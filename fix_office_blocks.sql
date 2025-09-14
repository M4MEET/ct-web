-- Update the ugly richText office block to clean featureGrid
UPDATE Block 
SET type = 'featureGrid',
    data = '{"id": "global-offices-locations", "type": "featureGrid", "visible": true, "heading": "Our Global Offices", "subheading": "Strategically located to serve clients across Europe, Asia, and beyond with local expertise and global standards", "columns": 2, "items": [{"icon": "🇬🇧", "title": "United Kingdom Office", "body": "📍 Unit 25 Fleetway Business Park\n12-14 Wadsworth Road, Perivale\nMiddlesex, England, UB6 7LD\n\n📞 +49 176 87998749\n✉️ info@codexterminal.com\n\n🇪🇺 European Client Support\n🕐 GMT/BST Coverage"}, {"icon": "🇮🇳", "title": "India Office", "body": "📍 Office No 305, 3rd Floor\nInternational Business Center\nPiplod, Gujarat, 395007, India\n\n📞 +49 176 87998749\n✉️ info@codexterminal.com\n\n🌏 Asian & Middle East Support\n🕐 IST Coverage"}]}'
WHERE id = 'cmfbl0fc0004aan2uguek7mn4';

-- Update the ugly richText global reach block to clean featureGrid
UPDATE Block 
SET type = 'featureGrid',
    data = '{"id": "global-coverage", "type": "featureGrid", "visible": true, "heading": "24/7 Global Coverage", "subheading": "Round-the-clock support across multiple time zones for uninterrupted service delivery", "columns": 3, "items": [{"icon": "🕐", "title": "UK Time Zone", "body": "GMT/BST Coverage\nEuropean business hours\nMorning to evening support\nLocal market expertise"}, {"icon": "🕐", "title": "India Time Zone", "body": "IST Coverage\nAsian & Middle East support\nOverlap with European hours\nContinuous development cycles"}, {"icon": "🌍", "title": "24/7 Support", "body": "Round-the-clock availability\nGlobal project coverage\nEmergency support\nSeamless handoffs"}]}'
WHERE id = 'cmfbl0fc0004ban2u3c2bx2lo';