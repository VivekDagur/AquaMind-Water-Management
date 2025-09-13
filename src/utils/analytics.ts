// Analytics tracking for AquaMind
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: 'AquaMind Water Management',
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'user_type',
        custom_parameter_2: 'demo_mode'
      }
    });
  }
};

// Track page views
export const trackPageView = (page: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title || page,
      page_location: `${window.location.origin}${page}`
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      custom_parameter_1: 'demo_user',
      custom_parameter_2: 'hackathon_demo'
    });
  }
};

// Track user interactions for hackathon demo
export const trackDemoInteraction = (interaction: string, details?: any) => {
  trackEvent(interaction, 'demo_interaction', JSON.stringify(details));
  
  // Also log to console for real-time monitoring during demo
  console.log('🎯 Demo Interaction:', {
    interaction,
    details,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_size: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`
  });
};

// Track tank monitoring events
export const trackTankEvent = (action: string, tankId: string, data?: any) => {
  trackEvent(action, 'tank_monitoring', `tank_${tankId}`, data?.value);
  
  // Store in localStorage for demo analytics
  const demoAnalytics = JSON.parse(localStorage.getItem('aquamind_demo_analytics') || '[]');
  demoAnalytics.push({
    type: 'tank_event',
    action,
    tankId,
    data,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('aquamind_demo_analytics', JSON.stringify(demoAnalytics.slice(-100))); // Keep last 100 events
};

// Track AI chat interactions
export const trackChatEvent = (action: string, message?: string) => {
  trackEvent(action, 'ai_chat', message?.substring(0, 50));
  
  const demoAnalytics = JSON.parse(localStorage.getItem('aquamind_demo_analytics') || '[]');
  demoAnalytics.push({
    type: 'chat_event',
    action,
    message: message?.substring(0, 100),
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('aquamind_demo_analytics', JSON.stringify(demoAnalytics.slice(-100)));
};

// Get demo analytics for judges
export const getDemoAnalytics = () => {
  const events = JSON.parse(localStorage.getItem('aquamind_demo_analytics') || '[]');
  const sessionStart = sessionStorage.getItem('aquamind_session_start') || new Date().toISOString();
  
  return {
    session_start: sessionStart,
    session_duration: Date.now() - new Date(sessionStart).getTime(),
    total_events: events.length,
    events_by_type: events.reduce((acc: any, event: any) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {}),
    recent_events: events.slice(-10),
    user_info: {
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform
    }
  };
};

// Initialize session tracking
export const initSession = () => {
  if (!sessionStorage.getItem('aquamind_session_start')) {
    sessionStorage.setItem('aquamind_session_start', new Date().toISOString());
  }
  
  trackDemoInteraction('session_start', {
    referrer: document.referrer,
    entry_page: window.location.pathname
  });
};

// Track form submissions and user onboarding
export const trackOnboarding = (step: string, data?: any) => {
  trackEvent('onboarding_step', 'user_flow', step);
  trackDemoInteraction('onboarding', { step, data });
};

// Track performance metrics
export const trackPerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    const metrics = {
      page_load_time: navigation.loadEventEnd - navigation.loadEventStart,
      dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      first_paint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
      first_contentful_paint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
    };
    
    trackEvent('performance_metrics', 'page_performance', JSON.stringify(metrics));
  }
};
