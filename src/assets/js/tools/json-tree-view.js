/**
 * JSON Tree View Component
 * A reusable component for displaying JSON data in an expandable/collapsible tree format
 */

class JsonTreeView {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      collapsed: false,
      maxDepth: Infinity,
      showTypes: false,
      showLength: false,
      indent: 20,
      ...options
    };
    
    this.data = null;
    this.expandedNodes = new Set();
  }

  /**
   * Render JSON data as a tree view
   * @param {*} data - The JSON data to render
   */
  render(data) {
    this.data = data;
    this.container.innerHTML = '';
    this.container.className = 'json-tree-view';
    
    const treeElement = this.createTreeElement(data, '', 0);
    this.container.appendChild(treeElement);
    
    // Add fullscreen toggle button
    this.addFullscreenControls();
  }

  /**
   * Create a tree element for a value
   * @param {*} value - The value to create an element for
   * @param {string} key - The key for this value
   * @param {number} depth - Current nesting depth
   * @returns {HTMLElement}
   */
  createTreeElement(value, key, depth = 0) {
    const element = document.createElement('div');
    element.className = 'json-tree-item';
    element.style.paddingLeft = `${depth * this.options.indent}px`;

    const type = this.getValueType(value);
    const isExpandable = this.isExpandableType(type);
    const nodeId = `${key}-${depth}-${Date.now()}-${Math.random()}`;

    if (isExpandable && depth < this.options.maxDepth) {
      const isExpanded = !this.options.collapsed || this.expandedNodes.has(nodeId);
      element.appendChild(this.createExpandableNode(value, key, depth, nodeId, isExpanded));
    } else {
      element.appendChild(this.createLeafNode(value, key, type));
    }

    return element;
  }

  /**
   * Create an expandable node (object or array)
   * @param {*} value - The object or array value
   * @param {string} key - The key for this value
   * @param {number} depth - Current nesting depth
   * @param {string} nodeId - Unique identifier for this node
   * @param {boolean} isExpanded - Whether the node should start expanded
   * @returns {HTMLElement}
   */
  createExpandableNode(value, key, depth, nodeId, isExpanded) {
    const container = document.createElement('div');
    
    // Create header with toggle
    const header = document.createElement('div');
    header.className = 'json-tree-header';
    header.style.cursor = 'pointer';
    header.style.userSelect = 'none';
    
    const toggle = document.createElement('span');
    toggle.className = `json-tree-toggle ${isExpanded ? 'expanded' : 'collapsed'}`;
    toggle.textContent = isExpanded ? '▼' : '▶';
    
    const keySpan = document.createElement('span');
    keySpan.className = 'json-tree-key';
    keySpan.textContent = key ? `"${key}": ` : '';
    
    const typeInfo = document.createElement('span');
    typeInfo.className = 'json-tree-type';
    const isArray = Array.isArray(value);
    const openBracket = isArray ? '[' : '{';
    const closeBracket = isArray ? ']' : '}';
    
    let typeText = openBracket;
    if (this.options.showLength) {
      const length = isArray ? value.length : Object.keys(value).length;
      typeText += length > 0 ? ` ${length} items ` : ' ';
    }
    if (!isExpanded) {
      typeText += closeBracket;
    }
    
    typeInfo.textContent = typeText;
    
    header.appendChild(toggle);
    header.appendChild(keySpan);
    header.appendChild(typeInfo);
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'json-tree-content';
    content.style.display = isExpanded ? 'block' : 'none';
    
    if (isExpanded) {
      this.populateExpandableContent(value, content, depth);
      
      // Add closing bracket
      const closingBracket = document.createElement('div');
      closingBracket.className = 'json-tree-item json-tree-type';
      closingBracket.style.paddingLeft = `${depth * this.options.indent}px`;
      closingBracket.textContent = closeBracket;
      content.appendChild(closingBracket);
    }
    
    // Add click handler for toggling
    header.addEventListener('click', () => {
      const wasExpanded = content.style.display === 'block';
      
      if (wasExpanded) {
        content.style.display = 'none';
        toggle.textContent = '▶';
        toggle.className = 'json-tree-toggle collapsed';
        this.expandedNodes.delete(nodeId);
        
        // Update type info to show closed bracket
        let typeText = openBracket;
        if (this.options.showLength) {
          const length = isArray ? value.length : Object.keys(value).length;
          typeText += length > 0 ? ` ${length} items ` : ' ';
        }
        typeText += closeBracket;
        typeInfo.textContent = typeText;
      } else {
        content.style.display = 'block';
        toggle.textContent = '▼';
        toggle.className = 'json-tree-toggle expanded';
        this.expandedNodes.add(nodeId);
        
        // Populate content if empty
        if (content.children.length === 0) {
          this.populateExpandableContent(value, content, depth);
          
          // Add closing bracket
          const closingBracket = document.createElement('div');
          closingBracket.className = 'json-tree-item json-tree-type';
          closingBracket.style.paddingLeft = `${depth * this.options.indent}px`;
          closingBracket.textContent = closeBracket;
          content.appendChild(closingBracket);
        }
        
        // Update type info to remove closing bracket
        let typeText = openBracket;
        if (this.options.showLength) {
          const length = isArray ? value.length : Object.keys(value).length;
          typeText += length > 0 ? ` ${length} items ` : ' ';
        }
        typeInfo.textContent = typeText;
      }
    });
    
    container.appendChild(header);
    container.appendChild(content);
    
    return container;
  }

  /**
   * Populate the content of an expandable node
   * @param {*} value - The object or array value
   * @param {HTMLElement} content - The content container
   * @param {number} depth - Current nesting depth
   */
  populateExpandableContent(value, content, depth) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const child = this.createTreeElement(item, index.toString(), depth + 1);
        child.querySelector('.json-tree-key').textContent = `[${index}]: `;
        content.appendChild(child);
      });
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([key, val]) => {
        const child = this.createTreeElement(val, key, depth + 1);
        content.appendChild(child);
      });
    }
  }

  /**
   * Create a leaf node (primitive value)
   * @param {*} value - The primitive value
   * @param {string} key - The key for this value
   * @param {string} type - The value type
   * @returns {HTMLElement}
   */
  createLeafNode(value, key, type) {
    const element = document.createElement('div');
    element.className = 'json-tree-leaf';
    
    const keySpan = document.createElement('span');
    keySpan.className = 'json-tree-key';
    keySpan.textContent = key ? `"${key}": ` : '';
    
    const valueSpan = document.createElement('span');
    valueSpan.className = `json-tree-value json-tree-value--${type}`;
    
    let displayValue;
    switch (type) {
      case 'string':
        displayValue = `"${value}"`;
        break;
      case 'null':
        displayValue = 'null';
        break;
      case 'undefined':
        displayValue = 'undefined';
        break;
      default:
        displayValue = String(value);
    }
    
    valueSpan.textContent = displayValue;
    
    if (this.options.showTypes) {
      const typeSpan = document.createElement('span');
      typeSpan.className = 'json-tree-type-label';
      typeSpan.textContent = ` (${type})`;
      valueSpan.appendChild(typeSpan);
    }
    
    element.appendChild(keySpan);
    element.appendChild(valueSpan);
    
    return element;
  }

  /**
   * Add fullscreen controls to the tree view
   */
  addFullscreenControls() {
    // Check if there's an external container for controls
    const externalContainer = document.getElementById('tree-controls-container');
    const controls = document.createElement('div');
    controls.className = externalContainer ? 'json-tree-controls-external' : 'json-tree-controls';
    
    // Main controls group
    const mainGroup = document.createElement('div');
    mainGroup.className = 'json-tree-controls-group';
    
    const expandAllBtn = document.createElement('button');
    expandAllBtn.className = 'json-tree-btn';
    expandAllBtn.textContent = '▼ Expand All';
    expandAllBtn.title = 'Expand all nodes';
    
    const collapseAllBtn = document.createElement('button');
    collapseAllBtn.className = 'json-tree-btn';
    collapseAllBtn.textContent = '▶ Collapse All';
    collapseAllBtn.title = 'Collapse all nodes';
    
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'json-tree-btn json-tree-btn--primary';
    fullscreenBtn.textContent = '⛶ Fullscreen';
    fullscreenBtn.title = 'Toggle fullscreen view';
    
    // Settings group
    const settingsGroup = document.createElement('div');
    settingsGroup.className = 'json-tree-toggle-setting';
    
    const metadataCheckbox = document.createElement('input');
    metadataCheckbox.type = 'checkbox';
    metadataCheckbox.id = 'show-metadata';
    metadataCheckbox.checked = this.options.showTypes && this.options.showLength;
    
    const metadataLabel = document.createElement('label');
    metadataLabel.htmlFor = 'show-metadata';
    metadataLabel.textContent = 'Show metadata';
    
    // Metadata toggle functionality
    metadataCheckbox.addEventListener('change', (e) => {
      const showMetadata = e.target.checked;
      this.options.showTypes = showMetadata;
      this.options.showLength = showMetadata;
      
      // Re-render the tree with new options
      if (this.data) {
        this.render(this.data);
      }
    });
    
    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', () => {
      if (this.container.classList.contains('json-tree-fullscreen')) {
        this.exitFullscreen();
        fullscreenBtn.textContent = '⛶ Fullscreen';
      } else {
        this.enterFullscreen();
        fullscreenBtn.textContent = '✕ Exit Fullscreen';
      }
    });
    
    // Expand all functionality
    expandAllBtn.addEventListener('click', () => {
      this.expandAll();
    });
    
    // Collapse all functionality
    collapseAllBtn.addEventListener('click', () => {
      this.collapseAll();
    });
    
    // Assemble controls
    mainGroup.appendChild(expandAllBtn);
    mainGroup.appendChild(collapseAllBtn);
    mainGroup.appendChild(fullscreenBtn);
    
    settingsGroup.appendChild(metadataCheckbox);
    settingsGroup.appendChild(metadataLabel);
    
    controls.appendChild(mainGroup);
    controls.appendChild(settingsGroup);
    
    // Insert controls into external container if available, otherwise inside tree container
    if (externalContainer) {
      externalContainer.innerHTML = '';
      externalContainer.appendChild(controls);
    } else {
      this.container.insertBefore(controls, this.container.firstChild);
    }
  }

  /**
   * Enter fullscreen mode
   */
  enterFullscreen() {
    this.container.classList.add('json-tree-fullscreen');
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.exitFullscreen();
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }

  /**
   * Exit fullscreen mode
   */
  exitFullscreen() {
    this.container.classList.remove('json-tree-fullscreen');
    document.body.style.overflow = '';
    
    // Remove escape key listener
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
    
    // Update button text
    const fullscreenBtn = this.container.querySelector('.json-tree-btn');
    if (fullscreenBtn) {
      fullscreenBtn.textContent = '⛶ Fullscreen';
    }
  }

  /**
   * Expand all nodes
   */
  expandAll() {
    const toggles = this.container.querySelectorAll('.json-tree-toggle');
    toggles.forEach(toggle => {
      if (toggle.classList.contains('collapsed')) {
        toggle.click();
      }
    });
  }

  /**
   * Collapse all nodes
   */
  collapseAll() {
    const toggles = this.container.querySelectorAll('.json-tree-toggle');
    toggles.forEach(toggle => {
      if (toggle.classList.contains('expanded')) {
        toggle.click();
      }
    });
  }

  /**
   * Get the type of a value
   * @param {*} value - The value to check
   * @returns {string}
   */
  getValueType(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  /**
   * Check if a type is expandable (object or array)
   * @param {string} type - The type to check
   * @returns {boolean}
   */
  isExpandableType(type) {
    return type === 'object' || type === 'array';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JsonTreeView;
}

// Make available globally
window.JsonTreeView = JsonTreeView;