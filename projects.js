/* ==========================================================================
   PROJECTS CMS HANDLER
   Loads project data from JSON and renders content dynamically
   ========================================================================== */

(function() {
  'use strict';

  // ==========================================================================
  // 1. DATA LOADING
  // ==========================================================================

  /**
   * Fetch projects data from JSON file
   * @returns {Promise<Array>} Array of project objects
   */
  async function loadProjects() {
    try {
      // Use absolute path from root to ensure it works on all pages
      const response = await fetch('/data/projects.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.projects || [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  /**
   * Get featured projects sorted by year (newest first)
   * @param {Array} projects - All projects
   * @param {number} limit - Maximum number of projects to return
   * @returns {Array} Featured projects
   */
  function getFeaturedProjects(projects, limit = 6) {
    return projects
      .filter(p => p.featured)
      .sort((a, b) => b.year - a.year)
      .slice(0, limit);
  }

  /**
   * Find project by slug
   * @param {Array} projects - All projects
   * @param {string} slug - Project slug
   * @returns {Object|null} Project object or null
   */
  function findProjectBySlug(projects, slug) {
    return projects.find(p => p.slug === slug) || null;
  }

  /**
   * Get previous and next projects for navigation
   * @param {Array} projects - All projects
   * @param {string} currentSlug - Current project slug
   * @returns {Object} Object with prev and next projects
   */
  function getProjectNavigation(projects, currentSlug) {
    // Create a copy before sorting to avoid mutating the original array
    const sortedProjects = [...projects].sort((a, b) => b.year - a.year);
    const currentIndex = sortedProjects.findIndex(p => p.slug === currentSlug);
    
    return {
      prev: currentIndex > 0 ? sortedProjects[currentIndex - 1] : null,
      next: currentIndex < sortedProjects.length - 1 ? sortedProjects[currentIndex + 1] : null
    };
  }

  /**
   * Check if image is a placeholder
   * @param {string} src - Image source
   * @returns {boolean}
   */
  function isPlaceholder(src) {
    return !src || src === 'placeholder' || src === '';
  }

  /**
   * Get image attributes for rendering
   * @param {string} src - Image source
   * @param {string} alt - Alt text
   * @returns {Object} Object with src and class
   */
  function getImageAttrs(src, _alt) {
    const fallbackSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e0e0e0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20fill%3D%22%23888%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EPlaceholder%3C%2Ftext%3E%3C%2Fsvg%3E";
    if (isPlaceholder(src)) {
      return {
        src: fallbackSvg,
        className: 'placeholder',
        onerror: ''
      };
    }
    return {
      src: src,
      className: '',
      onerror: `this.onerror=null;this.src='${fallbackSvg}';this.classList.add('placeholder');`
    };
  }

  // ==========================================================================
  // 2. PROJECT DETAIL PAGE RENDERING
  // ==========================================================================

  /**
   * Render project detail page content
   * @param {Object} project - Project data
   * @param {Object} nav - Navigation (prev/next) projects
   */
  function renderProjectDetail(project, nav) {
    if (!project) {
      window.location.href = '/404.html';
      return;
    }

    // Update page meta
    // Dynamic SEO: Update meta tags for specific project
    const seoTitle = `${project.title} - Case Study | Aleksandar Pavlov`;
    
    // Title
    document.title = seoTitle; 
    const pageTitleEl = document.getElementById('page-title');
    if (pageTitleEl) pageTitleEl.textContent = seoTitle;
    const pageDesc = document.getElementById('page-description');

    // Meta Description
    if (pageDesc) pageDesc.setAttribute('content', project.description);

    const cleanUrl = `https://aleksandarpavlov.netlify.app/${project.slug}`;
    
    // Canonical
    const pageCanonical = document.getElementById('page-canonical');
    if (pageCanonical) pageCanonical.setAttribute('href', cleanUrl);

    // Open Graph
    const ogTitle = document.getElementById('og-title');
    const ogDesc = document.getElementById('og-description');
    const ogImage = document.getElementById('og-image');
    const ogUrl = document.getElementById('og-url');

    if (ogTitle) ogTitle.setAttribute('content', seoTitle);
    if (ogDesc) ogDesc.setAttribute('content', project.description);
    if (ogImage && project.hero_image && !project.hero_image.startsWith('http')) {
         ogImage.setAttribute('content', `https://aleksandarpavlov.netlify.app/${project.hero_image}`);
    } else if (ogImage) {
         ogImage.setAttribute('content', project.hero_image);
    }
    if (ogUrl) ogUrl.setAttribute('content', cleanUrl);

    // Twitter
    const twTitle = document.getElementById('twitter-title');
    const twDesc = document.getElementById('twitter-description');
    const twImage = document.getElementById('twitter-image');

    if (twTitle) twTitle.setAttribute('content', seoTitle);
    if (twDesc) twDesc.setAttribute('content', project.description);
    if (twImage) {
        if (project.hero_image && !project.hero_image.startsWith('http')) {
             twImage.setAttribute('content', `https://aleksandarpavlov.netlify.app/${project.hero_image}`);
        } else {
             twImage.setAttribute('content', project.hero_image);
        }
    }

    // Hero section
    document.getElementById('project-eyebrow').textContent = `${project.category} · ${project.year}`;
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-description').textContent = project.description;
    // Full-Bleed Hero Image (New Placement)
    const heroFullSection = document.getElementById('project-hero-full');
    const heroFullImage = document.getElementById('project-hero-full-image');
    if (project.hero_image && heroFullSection && heroFullImage) {
        const hfAttrs = getImageAttrs(project.hero_image, `${project.title} project hero image`);
        heroFullImage.src = hfAttrs.src;
        heroFullImage.alt = `${project.title} project hero image`;
        if (hfAttrs.className) {
            heroFullImage.className = `project-hero-image ${hfAttrs.className}`;
        } else {
            heroFullImage.className = `project-hero-image`;
        }
        if (hfAttrs.onerror) {
            heroFullImage.setAttribute('onerror', hfAttrs.onerror);
        } else {
            heroFullImage.removeAttribute('onerror');
        }
        heroFullSection.style.display = 'block';
    } else if (heroFullSection) {
        heroFullSection.style.display = 'none';
    }

    // Brief & Persona section
    document.getElementById('project-client-persona').textContent = project.client_persona || project.client;
    
    // Tags
    const tagsContainer = document.getElementById('project-tags');
    tagsContainer.innerHTML = project.tags.map(tag => 
      `<span class="project-tag">${tag}</span>`
    ).join('');

    // The Brief (formerly Challenge)
    // We expect the JSON to eventually use 'the_brief' and 'design_concept', 
    // but for now we fallback to 'challenge' and 'solution' if the new keys aren't there yet.
    document.getElementById('project-brief-text').innerHTML = project.the_brief || project.challenge;

    // Dynamic Body Content (New Layout System) OR Legacy Concept
    const dynamicBodySection = document.getElementById('project-dynamic-body');
    const contentStream = document.getElementById('project-content-stream');
    const legacyConceptSection = document.getElementById('project-concept');
    const legacyBriefSection = document.getElementById('project-brief');
    
    if (project.content && Array.isArray(project.content) && dynamicBodySection && contentStream) {
        // Modern approach: process the content array
        if (legacyConceptSection) legacyConceptSection.style.display = 'none';
        
        // Ensure "The Challenge" block inside legacy logic is completely hidden
        const challengeHeader = document.querySelector('.brief-content');
        if (challengeHeader) challengeHeader.style.display = 'none';
        const briefGrid = document.querySelector('.brief-grid');
        if (briefGrid) briefGrid.classList.add('brief-meta-only');

        dynamicBodySection.style.display = 'block';
        contentStream.innerHTML = project.content.map(block => {
            if (block.type === 'text') {
                return `<div class="content-text-block rich-text" style="max-width: 800px; margin: 0 auto;">${block.body}</div>`;
            } else if (block.type === 'image_block') {
                const layoutClass = `layout-${block.layout_type || 'full_width'}`;
                const reversedClass = block.reverse ? 'is-reversed' : '';
                const videos = block.videos || [];
                const imagesHtml = (block.images || []).map((img, i) => {
                    const videoSrc = videos[i] || null;
                    const attrs = getImageAttrs(img, `Project image ${i + 1}`);
                    if (videoSrc) {
                        return `<video src="${videoSrc}" poster="${attrs.src}" autoplay muted loop playsinline preload="metadata" class="content-video" aria-label="Project video ${i + 1}"></video>`;
                    }
                    return `<img src="${attrs.src}" alt="Project image" class="${attrs.className}" ${attrs.onerror ? `onerror="${attrs.onerror}"` : ''} loading="lazy" />`;
                }).join('');
                
                const captionHtml = block.caption ? `<div class="image-block-caption">${block.caption}</div>` : '';
                
                return `
                <div class="content-media-block">
                    <div class="content-image-block image-layout-block ${layoutClass} ${reversedClass}">
                        ${imagesHtml}
                    </div>
                    ${captionHtml}
                </div>
                `;
            }
            return '';
        }).join('');
    } else if (project.design_concept || project.solution) {
        // Legacy approach: just show the rich text
        dynamicBodySection.style.display = 'none';
        if (legacyConceptSection) legacyConceptSection.style.display = 'block';
        if (legacyBriefSection) legacyBriefSection.style.display = 'block';
        document.getElementById('project-concept-text').innerHTML = project.design_concept || project.solution;
    } else {
        dynamicBodySection.style.display = 'none';
        if (legacyConceptSection) legacyConceptSection.style.display = 'none';
        if (legacyBriefSection) legacyBriefSection.style.display = 'none';
    }

    // Colour Palette
    const paletteBlock = document.getElementById('project-palette-block');
    const paletteContainer = document.getElementById('project-palette');
    if (project.palette && project.palette.length && paletteBlock && paletteContainer) {
        paletteContainer.innerHTML = project.palette
            .map(hex => `<span class="palette-swatch" style="background:${hex};"></span>`)
            .join('');
        paletteBlock.style.display = 'block';
    }

    // Live URL
    const liveUrlBlock = document.getElementById('project-live-url-block');
    const liveUrlLink = document.getElementById('project-live-url');
    if (project.live_url && liveUrlBlock && liveUrlLink) {
        liveUrlLink.href = project.live_url;
        liveUrlBlock.style.display = 'block';
    }

    // Deprecated features section logic removed here.

    // Metrics
    const metricsSection = document.getElementById('project-metrics');
    const metricsGrid = document.getElementById('project-metrics-grid');
    if (project.metrics && project.metrics.length > 0 && metricsSection && metricsGrid) {
        metricsSection.style.display = 'block';
        metricsGrid.innerHTML = project.metrics.map(metric => 
            `<div class="metric-item">
                <span style="display: block; font-family: var(--font-display); font-size: 2.5rem; color: var(--color-accent); margin-bottom: 0.5rem;">${metric.value}</span>
                <span style="display: block; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7;">${metric.label}</span>
             </div>`
        ).join('');
    }

    // Testimonial — hidden globally (projects are conceptual)

    // Gallery
    const gallerySection = document.getElementById('project-gallery');
    const galleryGrid = document.getElementById('project-gallery-grid');
    
    if (project.gallery && project.gallery.length > 0 && gallerySection && galleryGrid) {
      gallerySection.style.display = 'block';
      galleryGrid.innerHTML = project.gallery.map((img, index) => {
        const attrs = getImageAttrs(img, `${project.title} gallery image ${index + 1}`);
        return `<div class="gallery-item" style="border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
          <img src="${attrs.src}" alt="${project.title} gallery image" class="${attrs.className}" ${attrs.onerror ? `onerror="${attrs.onerror}"` : ''} loading="lazy" style="width: 100%; height: auto; display: block;" />
        </div>`;
      }).join('');
    }



    // Breadcrumbs
    const breadcrumbName = document.getElementById('breadcrumb-project-name');
    if (breadcrumbName) {
        breadcrumbName.textContent = project.title;
    }

    // Schema Markup Updates
    try {
        const projectSchemaScript = document.getElementById('schema-project');
        if (projectSchemaScript) {
            const schema = JSON.parse(projectSchemaScript.textContent);
            schema.name = project.title;
            schema.description = project.description;
            schema.url = cleanUrl;
            if (project.date) schema.dateCreated = project.date; // if available, else standard
            projectSchemaScript.textContent = JSON.stringify(schema, null, 2);
        }

        const breadcrumbSchemaScript = document.getElementById('schema-breadcrumb');
        if (breadcrumbSchemaScript) {
            const schema = JSON.parse(breadcrumbSchemaScript.textContent);
            // Update last item (Project Name)
            if (schema.itemListElement && schema.itemListElement.length >= 3) {
                schema.itemListElement[2].name = project.title;
                schema.itemListElement[2].item = `https://aleksandarpavlov.netlify.app/slug=${project.slug}`;
            }
            breadcrumbSchemaScript.textContent = JSON.stringify(schema, null, 2);
        }
    } catch (e) {
        console.error('Error updating schema:', e);
    }

    // Project Navigation
    const prevLink = document.getElementById('prev-project');
    const nextLink = document.getElementById('next-project');
    
    // Use fallback URLs locally to avoid Live Server 404s
    const isLocal = window.location.hostname !== 'aleksandarpavlov.netlify.app';
    
    if (nav.prev && prevLink) {
      prevLink.href = isLocal ? `/project.html#${nav.prev.slug}` : `/${nav.prev.slug}`;
      document.getElementById('prev-project-title').textContent = nav.prev.title;
      prevLink.style.display = 'flex';
    }

    if (nav.next && nextLink) {
      nextLink.href = isLocal ? `/project.html#${nav.next.slug}` : `/${nav.next.slug}`;
      document.getElementById('next-project-title').textContent = nav.next.title;
      nextLink.style.display = 'flex';
    }
  }

  // ==========================================================================
  // 3. HOMEPAGE PROJECTS GRID RENDERING
  // ==========================================================================

  /**
   * Render featured projects on homepage
   * @param {Array} projects - Featured projects
   */
  function renderHomepageProjects(projects) {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    // Update project count
    const countEl = document.querySelector('.project-count');
    if (countEl) {
      countEl.textContent = `(${String(projects.length).padStart(2, '0')})`;
    }
    
    // Use fallback URLs locally to avoid Live Server 404s
    const isLocal = window.location.hostname !== 'aleksandarpavlov.netlify.app';

    // Render project cards
    grid.innerHTML = projects.map((project, index) => {
      const thumbAttrs = getImageAttrs(project.thumbnail, `${project.title} project preview`);
      const projectUrl = isLocal ? `/project.html#${project.slug}` : `/${project.slug}`;
      return `
      <article class="project-card reveal" style="transition-delay: ${index * 100}ms;">
        <a href="${projectUrl}" class="project-card-link">
          <div class="project-image-wrapper">
            <img
              src="${thumbAttrs.src}"
              alt="${project.title} project preview"
              class="project-image ${thumbAttrs.className}"
              ${thumbAttrs.onerror ? `onerror="${thumbAttrs.onerror}"` : ''}
              width="400"
              height="284"
              loading="lazy"
            />
          </div>
          <div class="project-info">
            <div class="project-title-row">
              <h3 class="project-title">${project.title}</h3>
              <span class="arrow-content" aria-hidden="true">
                <img src="Icons/Cards-Arrow.svg" alt="" class="project-arrow arrow-default" />
                <img src="Icons/Cards-Arrow.svg" alt="" class="project-arrow arrow-hover" />
              </span>
            </div>
            <p class="project-category">${project.category}</p>
          </div>
        </a>
      </article>
    `;}).join('');

    // Re-trigger reveal animations for dynamically loaded content
    setTimeout(() => {
      const revealElements = grid.querySelectorAll('.reveal');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      revealElements.forEach(el => observer.observe(el));
    }, 100);
  }

  // ==========================================================================
  // 4. INITIALIZE
  // ==========================================================================

  async function init() {
    const projects = await loadProjects();
    if (projects.length === 0) {
      console.warn('No projects loaded');
      return;
    }

    // Determine current page type based on presence of specific elements
    const isProjectHero = document.getElementById('project-hero');
    const isProjectGrid = document.getElementById('project-grid');
    
    // Get slug from path (clean URL) or hash (legacy)
    // Example path: /corecloud -> corecloud
    // Example hash: /project.html#corecloud -> corecloud
    let slug = '';
    const path = window.location.pathname;
    
    // Check if the path is NOT a root or template file. Account for Live Server stripping .html
    if (path !== '/' && path !== '/index.html' && path !== '/project.html' && path !== '/project') {
      // Remove leading slash, and any trailing slashes just in case
      slug = path.substring(1).replace(/\/$/, '');
    } else if (window.location.hash) {
      slug = window.location.hash.replace('#', '');
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      slug = urlParams.get('slug');
    }

    if (isProjectHero) {
      // Project detail page
      if (slug) {
        const project = findProjectBySlug(projects, slug);
        if (project) {
          const nav = getProjectNavigation(projects, slug);
          renderProjectDetail(project, nav);
        } else {
          // If slug found but no project, might be 404 or bad URL
          console.error('Project not found:', slug);
          window.location.href = '/404.html';
        }
      } else {
        // Project page but no slug - show first project as fallback/default
        const firstProject = projects[0];
        const nav = getProjectNavigation(projects, firstProject.slug);
        renderProjectDetail(firstProject, nav);
      }
    } else if (isProjectGrid) {
      // Homepage - render featured projects
      const featuredProjects = getFeaturedProjects(projects, 6);
      renderHomepageProjects(featuredProjects);
    }
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
