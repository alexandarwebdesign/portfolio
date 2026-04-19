/* WebGL Image Carousel — adapted from akella/webGLImageTransitions demo3 */
(function () {
  'use strict';

  class WebGLCarousel {
    constructor(container, imageUrls, opts) {
      opts = opts || {};
      this.container = container;
      this.imageUrls = imageUrls;
      this.duration = opts.duration || 1.54;

      this.vertex = [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n');

      this.fragment = [
        'uniform float time;',
        'uniform float progress;',
        'uniform float width;',
        'uniform float radius;',
        'uniform sampler2D texture1;',
        'uniform sampler2D texture2;',
        'uniform sampler2D displacement;',
        'uniform vec4 resolution;',
        'varying vec2 vUv;',
        'float parabola(float x, float k) {',
        '  return pow(4.0 * x * (1.0 - x), k);',
        '}',
        'void main() {',
        '  vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);',
        '  vec2 uv = newUV;',
        '  vec2 start = vec2(0.5, 0.5);',
        '  vec2 aspect = resolution.wz;',
        '  vec4 noise = texture2D(displacement, fract(vUv + time * 0.04));',
        '  float prog = progress * 0.66 + noise.g * 0.02;',
        '  float circ = 1.0 - smoothstep(-width, 0.0, radius * distance(start * aspect, uv * aspect) - prog * (1.0 + width));',
        '  float intpl = pow(abs(circ), 1.0);',
        '  vec4 t1 = texture2D(texture1, (uv - 0.5) * (1.0 - intpl) + 0.5);',
        '  vec4 t2 = texture2D(texture2, (uv - 0.5) * intpl + 0.5);',
        '  gl_FragColor = mix(t1, t2, intpl);',
        '}'
      ].join('\n');

      this.textures = [];
      this.current = 0;
      this.isRunning = false;
      this.paused = true;
      this.time = 0;

      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      var canvas = this.renderer.domElement;
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
      this.container.appendChild(canvas);

      this.camera = new THREE.PerspectiveCamera(70, 1, 0.001, 1000);
      this.camera.position.set(0, 0, 2);

      this._loadAll(function () {
        this._addObjects();
        this._resize();
        window.addEventListener('resize', this._resize.bind(this));
        this.paused = false;
        this._render();
      }.bind(this));
    }

    _loadAll(cb) {
      var loader = new THREE.TextureLoader();
      var loaded = 0;
      var total = this.imageUrls.length;
      var self = this;

      this.imageUrls.forEach(function (url, i) {
        loader.load(url, function (tex) {
          self.textures[i] = tex;
          loaded++;
          if (loaded === total) cb();
        });
      });

      this.dispTex = loader.load('images/disp1.jpg');
    }

    _addObjects() {
      this.material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          time:         { value: 0 },
          progress:     { value: 0 },
          width:        { value: 0.2 },
          radius:       { value: 0.9 },
          texture1:     { value: this.textures[0] },
          texture2:     { value: this.textures[1] || this.textures[0] },
          displacement: { value: this.dispTex },
          resolution:   { value: new THREE.Vector4() }
        },
        vertexShader:   this.vertex,
        fragmentShader: this.fragment
      });

      var geo = new THREE.PlaneGeometry(1, 1, 2, 2);
      this.plane = new THREE.Mesh(geo, this.material);
      this.scene.add(this.plane);
    }

    _resize() {
      var w = this.container.offsetWidth;
      var h = this.container.offsetHeight;
      if (!w || !h || !this.textures[0] || !this.textures[0].image) return;

      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;

      var imgAspect = this.textures[0].image.height / this.textures[0].image.width;
      var a1, a2;
      if (h / w > imgAspect) {
        a1 = (w / h) * imgAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = (h / w) / imgAspect;
      }

      this.material.uniforms.resolution.value.set(w, h, a1, a2);

      var dist = this.camera.position.z;
      this.camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * dist));
      this.plane.scale.x = this.camera.aspect;
      this.camera.updateProjectionMatrix();
    }

    _transition(targetTex, newIndex) {
      if (this.isRunning || this.textures.length < 2) return;
      this.isRunning = true;
      this.material.uniforms.texture2.value = targetTex;
      var self = this;
      gsap.to(this.material.uniforms.progress, {
        duration: this.duration,
        value: 1,
        ease: 'power2.inOut',
        onComplete: function () {
          self.current = newIndex;
          self.material.uniforms.texture1.value = targetTex;
          self.material.uniforms.progress.value = 0;
          self.isRunning = false;
        }
      });
    }

    next() {
      var len = this.textures.length;
      var idx = (this.current + 1) % len;
      this._transition(this.textures[idx], idx);
    }

    prev() {
      var len = this.textures.length;
      var idx = (this.current - 1 + len) % len;
      this._transition(this.textures[idx], idx);
    }

    /* Fires next() exactly once when sectionEl is 35% into the viewport */
    watchOnce(sectionEl) {
      if (!sectionEl || !window.IntersectionObserver) {
        this.next();
        return;
      }
      var self = this;
      var fired = false;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!fired && entry.isIntersecting) {
            fired = true;
            observer.disconnect();
            self.next();
          }
        });
      }, { threshold: 0.35 });
      observer.observe(sectionEl);
    }

    _render() {
      if (this.paused) return;
      this.time += 0.05;
      this.material.uniforms.time.value = this.time;
      requestAnimationFrame(this._render.bind(this));
      this.renderer.render(this.scene, this.camera);
    }
  }

  window.WebGLCarousel = WebGLCarousel;

  function initAll() {
    document.querySelectorAll('[data-webgl-images]').forEach(function (el) {
      if (el._webglCarousel) return;
      try {
        var urls = JSON.parse(el.getAttribute('data-webgl-images'));
        var carousel = new WebGLCarousel(el, urls);
        el._webglCarousel = carousel;

        /* Wire prev/next buttons */
        if (el.id) {
          document.querySelectorAll('.carousel-btn[data-carousel="' + el.id + '"]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              if (btn.dataset.dir === 'next') carousel.next();
              else carousel.prev();
            });
          });
        }

        /* One-shot auto transition at 35% viewport */
        var sectionEl = el.closest('.carousel-outer') || el.closest('.single-block') || el;
        carousel.watchOnce(sectionEl);

      } catch (e) {
        console.warn('WebGLCarousel: failed to parse data-webgl-images', e);
      }
    });
  }

  window.initWebGLCarousels = initAll;
})();
