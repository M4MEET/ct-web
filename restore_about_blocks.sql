-- Hero Block (order 0)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'about_hero_restored',
    'hero',
    '{"id": "hero-about", "type": "hero", "visible": true, "eyebrow": "About CodeX Terminal", "headline": "Global Expertise, Local Excellence & Competitive Pricing", "subcopy": "We are a premier web development company with offices in the UK and India, offering world-class development services at highly competitive rates. Our global presence allows us to deliver 24/7 support while maintaining cost-effective solutions for businesses of all sizes.", "primaryCTA": {"label": "Get Free Quote", "href": "/contact"}, "secondaryCTA": {"label": "View Our Locations", "href": "#offices"}}',
    0,
    'cmfbkuqkm003yan2u7r9cspd6',
    datetime('now'),
    datetime('now')
);

-- Cost Advantages Block (order 1)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'cost_advantages_restored',
    'featureGrid',
    '{"id": "cost-advantages", "type": "featureGrid", "visible": true, "heading": "Why Choose CodeX Terminal - Unmatched Value & Quality", "columns": 3, "items": [{"icon": "💰", "title": "Up to 60% Cost Savings", "body": "Our strategic presence in India allows us to offer premium development services at significantly lower costs compared to Western agencies, without compromising on quality or expertise."}, {"icon": "🌍", "title": "Global Presence, Local Service", "body": "With offices in UK and India, we provide 24/7 support, cultural understanding, and time zone advantages that ensure seamless communication and project delivery."}, {"icon": "⚡", "title": "Faster Delivery", "body": "Our distributed teams work across time zones, enabling continuous development cycles and faster project completion while maintaining the highest quality standards."}]}',
    1,
    'cmfbkuqkm003yan2u7r9cspd6',
    datetime('now'),
    datetime('now')
);

-- Mission, Vision & Values (order 4)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'mission_vision_restored',
    'featureGrid',
    '{"id": "mission-vision-values", "type": "featureGrid", "visible": true, "heading": "Our Mission, Vision & Values", "columns": 3, "items": [{"icon": "🎯", "title": "Our Mission", "body": "To democratize world-class web development by making premium digital solutions accessible and affordable for businesses worldwide through our global expertise and competitive pricing model."}, {"icon": "🔮", "title": "Our Vision", "body": "To be the leading global web development partner, bridging the gap between premium quality and cost-effectiveness while maintaining the highest standards of service and innovation."}, {"icon": "💎", "title": "Our Values", "body": "Excellence in delivery • Transparent pricing • Cultural sensitivity • 24/7 availability • Cost-effective solutions • Global standards • Local expertise • Client success"}]}',
    4,
    'cmfbkuqkm003yan2u7r9cspd6',
    datetime('now'),
    datetime('now')
);

-- Global Advantages (order 5)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'global_advantages_restored',
    'featureGrid',
    '{"id": "why-choose-global", "type": "featureGrid", "visible": true, "heading": "Global Advantages & Cost Benefits", "columns": 2, "items": [{"icon": "💼", "title": "Enterprise Quality at Startup Prices", "body": "Access to senior developers and enterprise-grade solutions at costs that are 40-60% lower than traditional Western agencies • No compromise on quality or communication standards"}, {"icon": "🚀", "title": "Accelerated Development Cycles", "body": "24/7 development cycles across time zones • Faster time-to-market • Continuous integration and deployment • Real-time collaboration tools • Agile methodologies"}, {"icon": "🌐", "title": "Multi-Cultural Expertise", "body": "Deep understanding of Western business practices • Indian technical excellence • Cultural adaptability • Multi-language support • Local market insights • Global perspective"}, {"icon": "⭐", "title": "Premium Support & Communication", "body": "English-speaking teams • European business hours coverage • Video calls and real-time collaboration • Dedicated project managers • Regular progress updates • Transparent reporting"}]}',
    5,
    'cmfbkuqkm003yan2u7r9cspd6',
    datetime('now'),
    datetime('now')
);

-- Company Stats (order 6)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'company_stats_restored',
    'metrics',
    '{"id": "company-stats", "type": "metrics", "visible": true, "items": [{"label": "Cost Savings", "value": "60%", "helpText": "Average cost savings compared to Western agencies"}, {"label": "Projects Completed", "value": "200+", "helpText": "Successfully delivered across UK, EU, and Asia"}, {"label": "Global Clients", "value": "150+", "helpText": "Businesses served across 15+ countries"}, {"label": "Support Hours", "value": "24/7", "helpText": "Round-the-clock availability and support"}, {"label": "Time Zones", "value": "2", "helpText": "Strategic coverage for maximum efficiency"}, {"label": "Years Experience", "value": "5+", "helpText": "Proven track record in global markets"}]}',
    6,
    'cmfbkuqkm003yan2u7r9cspd6',
    datetime('now'),
    datetime('now')
);

-- Global Services (order 7)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'global_services_restored',
    'featureGrid',
    '{"id": "global-services", "type": "featureGrid", "visible": true, "heading": "Services Across Continents", "columns": 3, "items": [{"icon": "🇪🇺", "title": "European Markets", "body": "GDPR compliant solutions • Multi-language support • European payment gateways • Local business understanding • EU hosting options • Timezone-aligned communication"}, {"icon": "🇬🇧", "title": "UK Specialized Services", "body": "UK company registration systems • British payment methods • Local compliance requirements • UK-specific e-commerce solutions • Brexit-compliant data handling"}, {"icon": "🌏", "title": "Asian & Global Markets", "body": "Multi-currency platforms • International payment gateways • Cross-border e-commerce • Regional customizations • Global scalability • Emerging market expertise"}]}',
    7,
    'cmfbkuqkm003yan2u7r9cspd6',
    datetime('now'),
    datetime('now')
);

-- Contact Form (order 8)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'contact_about_restored',
    'contactForm',
    '{"id": "contact-about", "type": "contactForm", "visible": true, "formKey": "about-global-contact", "heading": "Ready for Premium Development at Competitive Costs?", "subcopy": "Get a free consultation and cost comparison. Discover how our global presence can deliver world-class solutions while reducing your development costs by up to 60%. Contact our UK or India office directly.", "successCopy": "Thank you for your interest! Our global team will review your requirements and provide a detailed cost comparison and project proposal within 24 hours.", "privacyNote": "Your information is secure and handled according to UK and Indian data protection standards."}',
    8,
    'cmfbkuqkm003yan2u7r9cspd6',
    datetime('now'),
    datetime('now')
);