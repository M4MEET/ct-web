-- Create About page with improved design
INSERT INTO Page (id, slug, locale, title, seo, status, createdAt, updatedAt, updatedById)
VALUES (
    'new_about_page_001',
    'about',
    'en',
    'About CodeX Terminal - Global Web Development with Competitive Costs',
    '{"title": "About CodeX Terminal | UK & India Offices | Cost-Effective Web Development", "description": "Learn about CodeX Terminal, a global web development company with offices in UK and India. We offer premium development services at competitive costs, serving clients worldwide with excellence."}',
    'published',
    datetime('now'),
    datetime('now'),
    NULL
);

-- Hero Block
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'about_hero_block',
    'hero',
    '{"id": "hero-about", "type": "hero", "visible": true, "eyebrow": "About CodeX Terminal", "headline": "Global Expertise, Local Excellence & Competitive Pricing", "subcopy": "We are a premier web development company with offices in the UK and India, offering world-class development services at highly competitive rates. Our global presence allows us to deliver 24/7 support while maintaining cost-effective solutions for businesses of all sizes.", "primaryCTA": {"label": "Get Free Quote", "href": "/contact"}, "secondaryCTA": {"label": "View Our Locations", "href": "#offices"}}',
    0,
    'new_about_page_001',
    datetime('now'),
    datetime('now')
);

-- Cost Advantages Block
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'cost_advantages_block',
    'featureGrid',
    '{"id": "cost-advantages", "type": "featureGrid", "visible": true, "heading": "Why Choose CodeX Terminal - Unmatched Value & Quality", "columns": 3, "items": [{"icon": "💰", "title": "Up to 60% Cost Savings", "body": "Our strategic presence in India allows us to offer premium development services at significantly lower costs compared to Western agencies, without compromising on quality or expertise."}, {"icon": "🌍", "title": "Global Presence, Local Service", "body": "With offices in UK and India, we provide 24/7 support, cultural understanding, and time zone advantages that ensure seamless communication and project delivery."}, {"icon": "⚡", "title": "Faster Delivery", "body": "Our distributed teams work across time zones, enabling continuous development cycles and faster project completion while maintaining the highest quality standards."}]}',
    1,
    'new_about_page_001',
    datetime('now'),
    datetime('now')
);

-- Global Offices Block (NEW IMPROVED DESIGN)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'global_offices_new',
    'featureGrid',
    '{"id": "global-offices-locations", "type": "featureGrid", "visible": true, "heading": "Our Global Offices", "subheading": "Strategically located to serve clients across Europe, Asia, and beyond with local expertise and global standards", "columns": 2, "items": [{"icon": "🇬🇧", "title": "United Kingdom Office", "body": "📍 Unit 25 Fleetway Business Park\n12-14 Wadsworth Road, Perivale\nMiddlesex, England, UB6 7LD\n\n📞 +49 176 87998749\n✉️ info@codexterminal.com\n\n🇪🇺 European Client Support\n🕐 GMT/BST Coverage"}, {"icon": "🇮🇳", "title": "India Office", "body": "📍 Office No 305, 3rd Floor\nInternational Business Center\nPiplod, Gujarat, 395007, India\n\n📞 +49 176 87998749\n✉️ info@codexterminal.com\n\n🌏 Asian & Middle East Support\n🕐 IST Coverage"}]}',
    2,
    'new_about_page_001',
    datetime('now'),
    datetime('now')
);

-- Global Coverage Block (NEW)
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'global_coverage_new',
    'featureGrid',
    '{"id": "global-coverage", "type": "featureGrid", "visible": true, "heading": "24/7 Global Coverage", "subheading": "Round-the-clock support across multiple time zones for uninterrupted service delivery", "columns": 3, "items": [{"icon": "🕐", "title": "UK Time Zone", "body": "GMT/BST Coverage\nEuropean business hours\nMorning to evening support\nLocal market expertise"}, {"icon": "🕐", "title": "India Time Zone", "body": "IST Coverage\nAsian & Middle East support\nOverlap with European hours\nContinuous development cycles"}, {"icon": "🌍", "title": "24/7 Support", "body": "Round-the-clock availability\nGlobal project coverage\nEmergency support\nSeamless handoffs"}]}',
    3,
    'new_about_page_001',
    datetime('now'),
    datetime('now')
);

-- Company Stats Block
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'company_stats_block',
    'metrics',
    '{"id": "company-stats", "type": "metrics", "visible": true, "items": [{"label": "Cost Savings", "value": "60%", "helpText": "Average cost savings compared to Western agencies"}, {"label": "Projects Completed", "value": "200+", "helpText": "Successfully delivered across UK, EU, and Asia"}, {"label": "Global Clients", "value": "150+", "helpText": "Businesses served across 15+ countries"}, {"label": "Support Hours", "value": "24/7", "helpText": "Round-the-clock availability and support"}]}',
    4,
    'new_about_page_001',
    datetime('now'),
    datetime('now')
);

-- Contact Form Block
INSERT INTO Block (id, type, data, "order", pageId, createdAt, updatedAt)
VALUES (
    'contact_about_block',
    'contactForm',
    '{"id": "contact-about", "type": "contactForm", "visible": true, "formKey": "about-global-contact", "heading": "Ready for Premium Development at Competitive Costs?", "subcopy": "Get a free consultation and cost comparison. Discover how our global presence can deliver world-class solutions while reducing your development costs by up to 60%.", "successCopy": "Thank you for your interest! Our global team will review your requirements and provide a detailed cost comparison and project proposal within 24 hours.", "privacyNote": "Your information is secure and handled according to UK and Indian data protection standards."}',
    5,
    'new_about_page_001',
    datetime('now'),
    datetime('now')
);