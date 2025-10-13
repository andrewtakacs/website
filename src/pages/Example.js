import React from 'react';
import styles from './Example.module.css';
import Button from '../components/Button';
import Card from '../components/Card';

const Example = () => {
  return (
    <div className="container">
      <div className="stack stack--gap-lg">
        <div className={styles.header}>
          <h1 className={styles.title}>New CSS Architecture</h1>
          <p className={styles.subtitle}>
            A lean, future-proof foundation with design tokens, utility classes, and CSS modules.
          </p>
        </div>

        <div className="grid grid--cols-1 grid--md-cols-2 grid--lg-cols-3 grid--gap-lg">
          <Card 
            title="Design Tokens" 
            subtitle="Centralized design system"
            hover
          >
            <p>All colors, spacing, typography, and other design values are defined in tokens.css</p>
            <div className="cluster cluster--gap-sm">
              <div className={styles.colorSwatch} style={{backgroundColor: 'var(--color-text-primary)'}}></div>
              <div className={styles.colorSwatch} style={{backgroundColor: 'var(--color-text-secondary)'}}></div>
              <div className={styles.colorSwatch} style={{backgroundColor: 'var(--color-text-muted)'}}></div>
            </div>
          </Card>

          <Card 
            title="Layout Utilities" 
            subtitle="Geometry primitives"
            hover
          >
            <p>Use utility classes for quick layouts and spacing:</p>
            <div className="flex flex--gap-4 mb-4">
              <div className="bg-primary-100 p-4 rounded-md">Flex item 1</div>
              <div className="bg-accent-100 p-4 rounded-md">Flex item 2</div>
            </div>
          </Card>

          <Card 
            title="Components" 
            subtitle="Shared UI primitives"
            hover
          >
            <p>Design-system atoms/molecules used across pages:</p>
            <div className="cluster cluster--gap-sm">
              <Button variant="default" size="sm">Default</Button>
              <Button variant="primary" size="sm">Primary</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
            </div>
          </Card>

          <Card 
            title="Motion Library" 
            subtitle="Intentional and quiet"
            hover
          >
            <p>Named keyframes and transition helpers:</p>
            <div className="cluster cluster--gap-sm">
              <div className="animate-fadeIn">Fade In</div>
              <div className="animate-scaleIn">Scale In</div>
              <div className="animate-shimmer">Shimmer</div>
            </div>
          </Card>

          <Card 
            title="Typography Scale" 
            subtitle="Consistent text hierarchy"
            hover
          >
            <div className="stack stack--gap-sm">
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <p>Body text with relaxed line height</p>
              <small>Small text for captions</small>
            </div>
          </Card>

          <Card 
            title="Spacing Scale" 
            subtitle="Consistent rhythm"
            hover
          >
            <div className="stack stack--gap-sm">
              {[1, 2, 3, 4, 6, 8].map(space => (
                <div key={space} className="flex flex--items-center flex--gap-4">
                  <div 
                    className={styles.spacingBar}
                    style={{width: `var(--space-${space})`}}
                  ></div>
                  <span className="text-sm text-muted">{space}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="stack stack--gap-lg">
          <h2 className="text-center">Layout Patterns</h2>
          
          <div className="sidebar">
            <div className="sidebar--content">
              <Card title="Main Content" elevated>
                <p>This is the main content area. The sidebar pattern creates a two-column layout that collapses elegantly on mobile.</p>
                <p>Use the sidebar utility class to create content + rail layouts for things like table of contents, related links, or metadata.</p>
              </Card>
            </div>
            <div className="sidebar--rail">
              <Card title="Sidebar" elevated>
                <div className="stack stack--gap-sm">
                  <a href="#" className="nav__link">Related Link 1</a>
                  <a href="#" className="nav__link">Related Link 2</a>
                  <a href="#" className="nav__link">Related Link 3</a>
                </div>
              </Card>
            </div>
          </div>

          <div className="stack stack--gap-md">
            <h3>Tags and Clusters</h3>
            <div className="cluster cluster--gap-sm">
              <span className="tag">React</span>
              <span className="tag">CSS Modules</span>
              <span className="tag">Design System</span>
              <span className="tag tag--selected">Selected</span>
              <span className="tag">JavaScript</span>
            </div>
          </div>

          <div className="stack stack--gap-md">
            <h3>Form Elements</h3>
            <div className="grid grid--cols-1 grid--md-cols-2 grid--gap-md">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="input" type="text" placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="input" type="email" placeholder="Enter your email" />
              </div>
            </div>
            <div className="cluster cluster--gap-sm">
              <Button variant="primary">Submit</Button>
              <Button variant="default">Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Example;