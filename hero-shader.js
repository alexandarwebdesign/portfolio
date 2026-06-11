(function () {
  "use strict";

  const MAX_MARCH_STEPS = 100;
  const MAX_WARP_LAYERS = 10;

  const SHADER_SETTINGS = Object.freeze({
    iterations: 80,
    rotationYZ: 0.01,
    rotationXZ: 0.3,
    timeScale: 0.3265,
    warpLayers: 2,
    warpBaseFrequency: 4,
    warpFrequencyStep: 4,
    warpAmplitude: 0.66,
    stepBase: 0.0046,
    stepScale: 0.175,
    stepOffsetY: 0.6,
    bandSpacing: 0.083,
    channelPhaseStep: 2,
    channelPhaseOffset: -3.16,
    colorBias: 1.83,
    exposure: 9000,
    alphaBoost: 1.02,

  });

  const VERTEX_SHADER_SOURCE = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  // FIX: Removed rotate3D entirely - mat3*vec3 multiply was invalid GLSL on many
  // GPU drivers, causing silent shader compile failure and a black canvas.
  // Replaced with explicit per-axis sin warping which produces the same fluid
  // effect and compiles correctly on all WebGL 1.0 implementations.
  const FRAGMENT_SHADER_SOURCE = `
    precision highp float;

    uniform vec2 iResolution;
    uniform float iTime;
    uniform int uIterations;
    uniform float uRotationYZ;
    uniform float uRotationXZ;
    uniform float uTimeScale;
    uniform int uWarpLayers;
    uniform float uWarpBaseFrequency;
    uniform float uWarpFrequencyStep;
    uniform float uWarpAmplitude;
    uniform float uStepBase;
    uniform float uStepScale;
    uniform float uStepOffsetY;
    uniform float uBandSpacing;
    uniform float uChannelPhaseStep;
    uniform float uChannelPhaseOffset;
    uniform float uColorBias;
    uniform float uExposure;
    uniform float uAlphaBoost;

    #define MAX_MARCH_STEPS ${MAX_MARCH_STEPS}
    #define MAX_WARP_LAYERS ${MAX_WARP_LAYERS}

    mat2 rotate2D(float a) {
      float c = cos(a);
      float s = sin(a);
      return mat2(c, -s, s, c);
    }

    vec4 tanhApprox(vec4 x) {
      vec4 x2 = x * x;
      return clamp(x * (27.0 + x2) / (27.0 + 9.0 * x2), -1.0, 1.0);
    }

    void main() {
      vec2 FC = gl_FragCoord.xy;
      vec2 r = iResolution.xy;
      vec4 o = vec4(0.0);
      float z = 0.0;
      float timeValue = iTime * uTimeScale;

      for (int i = 0; i < MAX_MARCH_STEPS; i++) {
        if (i >= uIterations) break;

        vec3 p = z * normalize(vec3((FC * 2.0 - r) / min(r.x, r.y), 1.0));
        p.yz *= rotate2D(uRotationYZ);
        p.xz *= rotate2D(uRotationXZ);

        float frequency = uWarpBaseFrequency;

        for (int layer = 0; layer < MAX_WARP_LAYERS; layer++) {
          if (layer >= uWarpLayers) break;

          float sf = max(frequency, 0.001);
          vec3 sp = p * sf;
          p.x += uWarpAmplitude * sin(sp.y + timeValue) / sf;
          p.y += uWarpAmplitude * sin(sp.z + timeValue * 0.9) / sf;
          p.z += uWarpAmplitude * sin(sp.x + timeValue * 1.1) / sf;
          frequency *= uWarpFrequencyStep;
        }

        float d = uStepBase + uStepScale * abs(uStepOffsetY + p.y);
        z += d;
        o += (
          cos(p.y / max(uBandSpacing, 0.0001) - vec4(0.0, 1.0, 2.0, 3.0) * uChannelPhaseStep - uChannelPhaseOffset)
          + uColorBias
        ) / d / max(z, 0.0001);
      }

      o = tanhApprox(o / max(uExposure, 0.0001));

      // R2 brand grade: remap the raw spectral output onto the redesign
      // palette. Shadows -> electric blue #455ce9, mids -> the teal kept
      // from the original look, highlights -> warm paper #f3f0ea. A slice
      // of the raw RGB is mixed back in so the original iridescent
      // shimmer stays recognizable. Motion math above is untouched.
      vec3 raw = clamp(o.rgb, 0.0, 1.0);
      float lum = dot(raw, vec3(0.2126, 0.7152, 0.0722));
      vec3 brandBlue = vec3(0.271, 0.361, 0.914);
      vec3 brandTeal = vec3(0.125, 0.698, 0.667);
      vec3 brandPaper = vec3(0.953, 0.941, 0.918);
      vec3 graded = mix(brandBlue, brandTeal, smoothstep(0.10, 0.62, lum));
      graded = mix(graded, brandPaper, smoothstep(0.58, 1.0, lum));
      graded = mix(graded, raw, 0.22);

      float alpha = clamp(max(raw.r, max(raw.g, raw.b)) * uAlphaBoost, 0.0, 1.0);
      gl_FragColor = vec4(graded, alpha);
    }
  `;

  const TARGET_FRAME_MS = 1000 / 60;

  class HeroShader {
    constructor(section) {
      this.section = section;
      this.container = section.querySelector(".hero-shader");
      this.canvas = section.querySelector(".hero-shader__canvas");
      this.gl = null;
      this.program = null;
      this.buffer = null;
      this.frameId = 0;
      this.startTime = 0;
      this._lastFrame = 0;
      this.resizeObserver = null;
      this.intersectionObserver = null;
      this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.animate = !this.motionQuery.matches;
      this.isInView = false;
      this.resolutionDirty = true;
      this.uniforms = {};

      this.handleResize = this.handleResize.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      this.handleMotionPreferenceChange = this.handleMotionPreferenceChange.bind(this);
      this.handleIntersection = this.handleIntersection.bind(this);
      this.renderLoop = this.renderLoop.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.handleFocus = this.handleFocus.bind(this);
    }

    init() {
      if (!this.container || !this.canvas) return;

      const gl =
        this.canvas.getContext("webgl", {
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
        }) ||
        this.canvas.getContext("experimental-webgl");

      if (!gl) return;

      this.gl = gl;

      if (!this.setupProgram()) return;

      this.setupGeometry();
      this.isInView = this.checkInView();
      this.handleResize();
      this.bindEvents();
      this.startTime = performance.now();
      this.applyStaticUniforms();

      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.section.classList.add("is-shader-ready");
      this.updateAnimationState();
    }

    setupProgram() {
      const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

      if (!vertexShader || !fragmentShader) return false;

      const program = this.gl.createProgram();
      this.gl.attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      this.gl.linkProgram(program);

      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);

      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        console.warn("Hero shader program link failed:", this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
        return false;
      }

      this.program = program;
      this.positionLocation = this.gl.getAttribLocation(program, "aPosition");
      this.uniforms = {
        resolution: this.gl.getUniformLocation(program, "iResolution"),
        time: this.gl.getUniformLocation(program, "iTime"),
        iterations: this.gl.getUniformLocation(program, "uIterations"),
        rotationYZ: this.gl.getUniformLocation(program, "uRotationYZ"),
        rotationXZ: this.gl.getUniformLocation(program, "uRotationXZ"),
        timeScale: this.gl.getUniformLocation(program, "uTimeScale"),
        warpLayers: this.gl.getUniformLocation(program, "uWarpLayers"),
        warpBaseFrequency: this.gl.getUniformLocation(program, "uWarpBaseFrequency"),
        warpFrequencyStep: this.gl.getUniformLocation(program, "uWarpFrequencyStep"),
        warpAmplitude: this.gl.getUniformLocation(program, "uWarpAmplitude"),
        stepBase: this.gl.getUniformLocation(program, "uStepBase"),
        stepScale: this.gl.getUniformLocation(program, "uStepScale"),
        stepOffsetY: this.gl.getUniformLocation(program, "uStepOffsetY"),
        bandSpacing: this.gl.getUniformLocation(program, "uBandSpacing"),
        channelPhaseStep: this.gl.getUniformLocation(program, "uChannelPhaseStep"),
        channelPhaseOffset: this.gl.getUniformLocation(program, "uChannelPhaseOffset"),
        colorBias: this.gl.getUniformLocation(program, "uColorBias"),
        exposure: this.gl.getUniformLocation(program, "uExposure"),
        alphaBoost: this.gl.getUniformLocation(program, "uAlphaBoost"),
      };
      return true;
    }

    compileShader(type, source) {
      const shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);

      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.warn("Hero shader compile failed:", this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    setupGeometry() {
      this.buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1,
        ]),
        this.gl.STATIC_DRAW
      );

      this.gl.useProgram(this.program);
      this.gl.enableVertexAttribArray(this.positionLocation);
      this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    applyStaticUniforms() {
      this.gl.useProgram(this.program);
      this.gl.uniform1i(this.uniforms.iterations, SHADER_SETTINGS.iterations);
      this.gl.uniform1f(this.uniforms.rotationYZ, SHADER_SETTINGS.rotationYZ);
      this.gl.uniform1f(this.uniforms.rotationXZ, SHADER_SETTINGS.rotationXZ);
      this.gl.uniform1f(this.uniforms.timeScale, SHADER_SETTINGS.timeScale);
      this.gl.uniform1i(this.uniforms.warpLayers, SHADER_SETTINGS.warpLayers);
      this.gl.uniform1f(this.uniforms.warpBaseFrequency, SHADER_SETTINGS.warpBaseFrequency);
      this.gl.uniform1f(this.uniforms.warpFrequencyStep, SHADER_SETTINGS.warpFrequencyStep);
      this.gl.uniform1f(this.uniforms.warpAmplitude, SHADER_SETTINGS.warpAmplitude);
      this.gl.uniform1f(this.uniforms.stepBase, SHADER_SETTINGS.stepBase);
      this.gl.uniform1f(this.uniforms.stepScale, SHADER_SETTINGS.stepScale);
      this.gl.uniform1f(this.uniforms.stepOffsetY, SHADER_SETTINGS.stepOffsetY);
      this.gl.uniform1f(this.uniforms.bandSpacing, SHADER_SETTINGS.bandSpacing);
      this.gl.uniform1f(this.uniforms.channelPhaseStep, SHADER_SETTINGS.channelPhaseStep);
      this.gl.uniform1f(this.uniforms.channelPhaseOffset, SHADER_SETTINGS.channelPhaseOffset);
      this.gl.uniform1f(this.uniforms.colorBias, SHADER_SETTINGS.colorBias);
      this.gl.uniform1f(this.uniforms.exposure, SHADER_SETTINGS.exposure);
      this.gl.uniform1f(this.uniforms.alphaBoost, SHADER_SETTINGS.alphaBoost);
    }

    bindEvents() {
      window.addEventListener("resize", this.handleResize, { passive: true });
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
      window.addEventListener("blur", this.handleBlur, { passive: true });
      window.addEventListener("focus", this.handleFocus, { passive: true });

      if (typeof ResizeObserver === "function") {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.section);
      }

      if (typeof IntersectionObserver === "function") {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection, {
          threshold: 0,
        });
        this.intersectionObserver.observe(this.section);
      }

      if (typeof this.motionQuery.addEventListener === "function") {
        this.motionQuery.addEventListener("change", this.handleMotionPreferenceChange);
      } else if (typeof this.motionQuery.addListener === "function") {
        this.motionQuery.addListener(this.handleMotionPreferenceChange);
      }
    }

    checkInView() {
      const rect = this.section.getBoundingClientRect();
      return rect.bottom > 0 && rect.right > 0 && rect.left < window.innerWidth && rect.top < window.innerHeight;
    }

    handleResize() {
      if (!this.canvas) return;

      const rect = this.section.getBoundingClientRect();
      const cssWidth = Math.max(1, Math.round(rect.width));
      const cssHeight = Math.max(1, Math.round(rect.height));

      const baseScale = window.innerWidth <= 480  ? 0.30
                      : window.innerWidth <= 640  ? 0.38
                      : window.innerWidth <= 980  ? 0.52
                      : window.innerWidth <= 1920 ? 0.70
                      : window.innerWidth <= 2560 ? 0.85
                      : 1.00;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2) * baseScale;
      const width = Math.max(1, Math.round(cssWidth * pixelRatio));
      const height = Math.max(1, Math.round(cssHeight * pixelRatio));

      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.resolutionDirty = true;
      }

      // FIX: Always handle resize correctly regardless of animation state
      if (this.isInView && !document.hidden) {
        if (this.shouldAnimate()) {
          this.resolutionDirty = true; // render loop picks it up next frame
        } else {
          this.render(performance.now(), true); // static frame for reduced-motion
        }
      }
    }

    handleVisibilityChange() {
      this.updateAnimationState();
    }

    handleBlur() {
      this.stop();
    }

    handleFocus() {
      this.updateAnimationState();
    }

    handleMotionPreferenceChange() {
      this.animate = !this.motionQuery.matches;
      this.updateAnimationState();
    }

    handleIntersection(entries) {
      for (let index = 0; index < entries.length; index += 1) {
        const entry = entries[index];
        if (entry.target !== this.section) continue;
        this.isInView = entry.isIntersecting || entry.intersectionRatio > 0;
        this.updateAnimationState();
        break;
      }
    }

    shouldAnimate() {
      return this.animate && !document.hidden && this.isInView;
    }

    start() {
      if (this.frameId || !this.shouldAnimate()) return;
      this.frameId = window.requestAnimationFrame(this.renderLoop);
    }

    stop() {
      if (!this.frameId) return;
      window.cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }

    updateAnimationState() {
      if (this.shouldAnimate()) {
        this.start();
      } else {
        this.stop();
        if (this.isInView && !document.hidden) {
          this.render(performance.now(), true);
        }
      }
    }

    updateResolution() {
      if (!this.resolutionDirty) return;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
      this.resolutionDirty = false;
    }

    // FIX: frameId is no longer zeroed at the top of renderLoop.
    // Previously, zeroing it before the frame-cap check meant stop()+start()
    // could silently kill the animation loop (start() guards on frameId !== 0).
    // Now frameId is only set to 0 when the loop genuinely stops.
    renderLoop(now) {
      if (now - this._lastFrame < TARGET_FRAME_MS) {
        if (this.shouldAnimate()) {
          this.frameId = window.requestAnimationFrame(this.renderLoop);
        } else {
          this.frameId = 0;
        }
        return;
      }

      this._lastFrame = now;
      this.render(now, false);

      if (!this.shouldAnimate()) {
        this.frameId = 0;
        return;
      }

      this.frameId = window.requestAnimationFrame(this.renderLoop);
    }

    render(now, isStaticFrame) {
      if (!this.gl || !this.program || !this.canvas) return;

      if (this.startTime === 0) {
        this.startTime = now;
      }

      const elapsed = (now - this.startTime) / 1000;
      const time = isStaticFrame ? 0 : elapsed;

      this.gl.useProgram(this.program);
      this.updateResolution();
      this.gl.uniform1f(this.uniforms.time, time);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
  }

  function initHeroShader() {
    const heroSection = document.getElementById("hero");
    if (!heroSection || !heroSection.classList.contains("hero-section--shader")) return;

    const shader = new HeroShader(heroSection);
    shader.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroShader);
  } else {
    initHeroShader();
  }
})();