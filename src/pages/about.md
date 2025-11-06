---
layout: layouts/base.njk
title: About DevTools Center
description: Learn about DevTools Center - your go-to source for free online developer tools and utilities.
permalink: /about/
---

<div class="content-container about-page">
  <!-- Hero Section -->
  <div class="about-hero">
    <h1 class="about-title">About DevTools Center</h1>
    <p class="about-subtitle">
      Empowering developers worldwide with fast, free, and secure tools for everyday development tasks
    </p>
  </div>

  <!-- Mission Card -->
  <div class="mission-card">
    <div class="mission-overlay"></div>
    <div class="mission-content">
      <div class="mission-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      </div>
      <h2 class="mission-title">Our Mission</h2>
      <p class="mission-description">
        DevTools Center was created to provide developers worldwide with fast, free, and secure tools
        for everyday development tasks. We believe that essential developer utilities should be accessible
        to everyone, without barriers, registration requirements, or hidden costs.
      </p>
    </div>
  </div>

  <!-- Why DevTools Center Section -->
  <div class="why-section">
    <h2 class="section-title centered">Why DevTools Center?</h2>
    
    <div class="feature-grid">
      <!-- Privacy First -->
      <div class="feature-card">
        <div class="feature-content">
          <div class="feature-icon privacy-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div class="feature-text">
            <h3 class="feature-title">Privacy First</h3>
            <p class="feature-description">
              All our tools run entirely in your web browser. Your data never leaves your device, and we don't
              store or transmit any information you process. This ensures maximum privacy and security for your
              sensitive development work.
            </p>
          </div>
        </div>
      </div>

      <!-- Lightning Fast -->
      <div class="feature-card">
        <div class="feature-content">
          <div class="feature-icon speed-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="feature-text">
            <h3 class="feature-title">Lightning Fast</h3>
            <p class="feature-description">
              By processing everything client-side, our tools provide instant results without server round-trips.
              This means faster performance and the ability to work even when offline.
            </p>
          </div>
        </div>
      </div>

      <!-- Always Free -->
      <div class="feature-card">
        <div class="feature-content">
          <div class="feature-icon free-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div class="feature-text">
            <h3 class="feature-title">Always Free</h3>
            <p class="feature-description">
              We're committed to keeping all our tools free forever. No subscriptions, no paywalls, no premium
              tiers. Just pure, unadulterated developer utilities available to everyone.
            </p>
          </div>
        </div>
      </div>

      <!-- Modern Design -->
      <div class="feature-card">
        <div class="feature-content">
          <div class="feature-icon design-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <div class="feature-text">
            <h3 class="feature-title">Modern Design</h3>
            <p class="feature-description">
              We believe tools should be both functional and beautiful. Our clean, minimalist design with dark
              mode support makes it easy to focus on your work, whether you're coding at noon or midnight.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Our Tools Section -->
  <div class="tools-section">
    <h2 class="section-title centered">Our Tools</h2>
    <p class="section-description centered">
      We currently offer {{ collections.tools | size }} essential developer tools:
    </p>
    <div class="tools-grid">{% for tool in collections.tools %}
      <a href="{{ tool.url }}" class="tool-item" aria-label="Go to {{ tool.data.title }}">
        <div class="tool-icon">
          <span>{{ tool.data.icon or '🔧' }}</span>
        </div>
        <div class="tool-info">
          <strong class="tool-name">{{ tool.data.title }}</strong>
          <span class="tool-description">{{ tool.data.description }}</span>
        </div>
      </a>{% endfor %}
    </div>
    
    <p class="tools-note">
      We're constantly working on adding more tools based on community feedback and common developer needs.
    </p>
  </div>

  <!-- Technology Section -->
  <div class="technology-section">
    <h2 class="section-title centered">Technology</h2>
    <div class="tech-grid">
      <div class="tech-card">
        <div class="tech-name">Eleventy</div>
        <div class="tech-description">Static Site Generation</div>
      </div>
      <div class="tech-card">
        <div class="tech-name">CSS Variables</div>
        <div class="tech-description">Theming System</div>
      </div>
      <div class="tech-card">
        <div class="tech-name">JavaScript</div>
        <div class="tech-description">Vanilla JS</div>
      </div>
      <div class="tech-card">
        <div class="tech-name">Cloudflare</div>
        <div class="tech-description">Global Hosting</div>
      </div>
    </div>
  </div>

  <!-- Open Source Section -->
  <div class="opensource-section">
    <h2 class="section-title">Open Source</h2>
    <p class="section-description">
      We believe in transparency and community collaboration. While our codebase is currently private,
      we're exploring options to open-source parts of our project to benefit the developer community.
    </p>
  </div>

  <!-- Future Plans Section -->
  <div class="future-section">
    <h2 class="section-title centered">Future Plans</h2>
    <div class="future-grid">
      <div class="future-card">
        <div class="future-icon">🚀</div>
        <h3 class="future-title">More Tools</h3>
        <p class="future-description">Additional developer tools based on community requests</p>
      </div>
      <div class="future-card">
        <div class="future-icon">⚡</div>
        <h3 class="future-title">Enhanced Features</h3>
        <p class="future-description">Improved functionality for existing tools</p>
      </div>
      <div class="future-card">
        <div class="future-icon">⌨️</div>
        <h3 class="future-title">Keyboard Shortcuts</h3>
        <p class="future-description">Power-user features and shortcuts</p>
      </div>
      <div class="future-card">
        <div class="future-icon">🎨</div>
        <h3 class="future-title">Customization</h3>
        <p class="future-description">Tool customization options</p>
      </div>
      <div class="future-card">
        <div class="future-icon">📚</div>
        <h3 class="future-title">API Docs</h3>
        <p class="future-description">API documentation generators</p>
      </div>
      <div class="future-card">
        <div class="future-icon">✨</div>
        <h3 class="future-title">And More</h3>
        <p class="future-description">Exciting features coming soon</p>
      </div>
    </div>
  </div>

  <!-- Get In Touch Section -->
  <div class="contact-section">
    <h2 class="contact-title">Get In Touch</h2>
    <p class="contact-description">
      We'd love to hear from you! Whether you have feedback, feature requests, bug reports, or just
      want to say hi, please don't hesitate to reach out.
    </p>
    <a href="/contact/" class="contact-button">
      <span>Contact Us</span>
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </a>
  </div>
</div>

