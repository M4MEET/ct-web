// This script will recreate the About page through the admin API to ensure visibility

const aboutPageData = {
  slug: "about",
  locale: "en",
  title: "About CodeX Terminal - Global Web Development with Competitive Costs",
  seo: {
    title: "About CodeX Terminal | UK & India Offices | Cost-Effective Web Development",
    description: "Learn about CodeX Terminal, a global web development company with offices in UK and India. We offer premium development services at competitive costs, serving clients worldwide with excellence.",
    canonical: "https://codexterminal.com/about"
  },
  status: "published",
  blocks: [
    {
      id: "hero-about",
      type: "hero",
      visible: true,
      eyebrow: "About CodeX Terminal",
      headline: "Global Expertise, Local Excellence & Competitive Pricing",
      subcopy: "We are a premier web development company with offices in the UK and India, offering world-class development services at highly competitive rates. Our global presence allows us to deliver 24/7 support while maintaining cost-effective solutions for businesses of all sizes.",
      primaryCTA: {
        label: "Get Free Quote",
        href: "/contact"
      },
      secondaryCTA: {
        label: "View Our Locations",
        href: "#offices"
      }
    },
    {
      id: "cost-advantages",
      type: "featureGrid",
      visible: true,
      heading: "Why Choose CodeX Terminal - Unmatched Value & Quality",
      columns: 3,
      items: [
        {
          icon: "💰",
          title: "Up to 60% Cost Savings",
          body: "Our strategic presence in India allows us to offer premium development services at significantly lower costs compared to Western agencies, without compromising on quality or expertise."
        },
        {
          icon: "🌍",
          title: "Global Presence, Local Service",
          body: "With offices in UK and India, we provide 24/7 support, cultural understanding, and time zone advantages that ensure seamless communication and project delivery."
        },
        {
          icon: "⚡",
          title: "Faster Delivery",
          body: "Our distributed teams work across time zones, enabling continuous development cycles and faster project completion while maintaining the highest quality standards."
        }
      ]
    },
    {
      id: "global-offices",
      type: "richText",
      visible: true,
      content: `<h2 id="offices">Our Global Offices</h2><p>CodeX Terminal operates from strategically located offices in the UK and India, allowing us to serve clients across Europe, Asia, and beyond with local expertise and global standards.</p><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin: 3rem 0;"><div style="padding: 2rem; border-radius: 16px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);"><h3 style="margin: 0 0 1.5rem 0; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">🇬🇧 United Kingdom Office</h3><div style="space-y: 1rem;"><div style="margin-bottom: 1rem;"><strong style="display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">📍 Location</strong><p style="margin: 0; line-height: 1.5;">Unit 25 Fleetway Business Park<br>12-14 Wadsworth Road, Perivale<br>Middlesex, England, UB6 7LD</p></div><div style="margin-bottom: 1rem;"><strong style="display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">📞 Support</strong><p style="margin: 0;"><a href="tel:+4917687998749" style="color: white; text-decoration: none;">+49 176 87998749</a></p></div><div><strong style="display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">✉️ Email</strong><p style="margin: 0;"><a href="mailto:info@codexterminal.com" style="color: white; text-decoration: none;">info@codexterminal.com</a></p></div></div></div><div style="padding: 2rem; border-radius: 16px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);"><h3 style="margin: 0 0 1.5rem 0; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">🇮🇳 India Office</h3><div style="space-y: 1rem;"><div style="margin-bottom: 1rem;"><strong style="display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">📍 Location</strong><p style="margin: 0; line-height: 1.5;">Office No 305, 3rd Floor<br>International Business Center<br>Piplod, Gujarat, 395007, India</p></div><div style="margin-bottom: 1rem;"><strong style="display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">📞 Support</strong><p style="margin: 0;"><a href="tel:+4917687998749" style="color: white; text-decoration: none;">+49 176 87998749</a></p></div><div><strong style="display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">✉️ Email</strong><p style="margin: 0;"><a href="mailto:info@codexterminal.com" style="color: white; text-decoration: none;">info@codexterminal.com</a></p></div></div></div></div>`
    },
    {
      id: "global-map",
      type: "richText",
      visible: true,
      content: `<h2>Our Global Reach</h2><p>Strategically positioned to serve clients worldwide with local expertise and global standards.</p><div style="margin: 2rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);"><iframe src="https://www.google.com/maps/d/embed?mid=1YqQxy8kGF2OWJhIqVw5rKcGkqcQXJxs&ehbc=2E312F" width="100%" height="400" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; text-align: center;"><div style="padding: 1.5rem; border-radius: 12px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border: 1px solid #cbd5e1;"><h4 style="margin: 0 0 0.5rem 0; color: #1e40af;">🕐 UK Time Zone</h4><p style="margin: 0; font-size: 0.9rem; color: #64748b;">GMT/BST Coverage<br>European Client Support</p></div><div style="padding: 1.5rem; border-radius: 12px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1px solid #bbf7d0;"><h4 style="margin: 0 0 0.5rem 0; color: #059669;">🕐 India Time Zone</h4><p style="margin: 0; font-size: 0.9rem; color: #64748b;">IST Coverage<br>Asian & Middle East Support</p></div><div style="padding: 1.5rem; border-radius: 12px; background: linear-gradient(135deg, #fefce8, #fef3c7); border: 1px solid #fcd34d;"><h4 style="margin: 0 0 0.5rem 0; color: #d97706;">🌍 24/7 Support</h4><p style="margin: 0; font-size: 0.9rem; color: #64748b;">Round-the-clock<br>Global Coverage</p></div></div>`
    },
    {
      id: "mission-vision-values",
      type: "featureGrid", 
      visible: true,
      heading: "Our Mission, Vision & Values",
      columns: 3,
      items: [
        {
          icon: "🎯",
          title: "Our Mission",
          body: "To democratize world-class web development by making premium digital solutions accessible and affordable for businesses worldwide through our global expertise and competitive pricing model."
        },
        {
          icon: "🔮",
          title: "Our Vision", 
          body: "To be the leading global web development partner, bridging the gap between premium quality and cost-effectiveness while maintaining the highest standards of service and innovation."
        },
        {
          icon: "💎",
          title: "Our Values",
          body: "Excellence in delivery • Transparent pricing • Cultural sensitivity • 24/7 availability • Cost-effective solutions • Global standards • Local expertise • Client success"
        }
      ]
    },
    {
      id: "why-choose-global",
      type: "featureGrid",
      visible: true,
      heading: "Global Advantages & Cost Benefits", 
      columns: 2,
      items: [
        {
          icon: "💼",
          title: "Enterprise Quality at Startup Prices",
          body: "Access to senior developers and enterprise-grade solutions at costs that are 40-60% lower than traditional Western agencies • No compromise on quality or communication standards"
        },
        {
          icon: "🚀", 
          title: "Accelerated Development Cycles",
          body: "24/7 development cycles across time zones • Faster time-to-market • Continuous integration and deployment • Real-time collaboration tools • Agile methodologies"
        },
        {
          icon: "🌐",
          title: "Multi-Cultural Expertise", 
          body: "Deep understanding of Western business practices • Indian technical excellence • Cultural adaptability • Multi-language support • Local market insights • Global perspective"
        },
        {
          icon: "⭐",
          title: "Premium Support & Communication",
          body: "English-speaking teams • European business hours coverage • Video calls and real-time collaboration • Dedicated project managers • Regular progress updates • Transparent reporting"
        }
      ]
    },
    {
      id: "company-stats",
      type: "metrics",
      visible: true,
      items: [
        {
          label: "Cost Savings",
          value: "60%",
          helpText: "Average cost savings compared to Western agencies"
        },
        {
          label: "Projects Completed", 
          value: "200+",
          helpText: "Successfully delivered across UK, EU, and Asia"
        },
        {
          label: "Global Clients",
          value: "150+",
          helpText: "Businesses served across 15+ countries"
        },
        {
          label: "Support Hours",
          value: "24/7",
          helpText: "Round-the-clock availability and support"
        },
        {
          label: "Time Zones",
          value: "2", 
          helpText: "Strategic coverage for maximum efficiency"
        },
        {
          label: "Years Experience",
          value: "5+",
          helpText: "Proven track record in global markets"
        }
      ]
    },
    {
      id: "global-services",
      type: "featureGrid",
      visible: true,
      heading: "Services Across Continents",
      columns: 3,
      items: [
        {
          icon: "🇪🇺",
          title: "European Markets",
          body: "GDPR compliant solutions • Multi-language support • European payment gateways • Local business understanding • EU hosting options • Timezone-aligned communication"
        },
        {
          icon: "🇬🇧",
          title: "UK Specialized Services", 
          body: "UK company registration systems • British payment methods • Local compliance requirements • UK-specific e-commerce solutions • Brexit-compliant data handling"
        },
        {
          icon: "🌏",
          title: "Asian & Global Markets",
          body: "Multi-currency platforms • International payment gateways • Cross-border e-commerce • Regional customizations • Global scalability • Emerging market expertise"
        }
      ]
    },
    {
      id: "contact-about",
      type: "contactForm",
      visible: true,
      formKey: "about-global-contact",
      heading: "Ready for Premium Development at Competitive Costs?",
      subcopy: "Get a free consultation and cost comparison. Discover how our global presence can deliver world-class solutions while reducing your development costs by up to 60%. Contact our UK or India office directly.",
      successCopy: "Thank you for your interest! Our global team will review your requirements and provide a detailed cost comparison and project proposal within 24 hours.",
      privacyNote: "Your information is secure and handled according to UK and Indian data protection standards."
    }
  ]
};

async function createAboutPageInAdmin() {
  try {
    // First, check if the page already exists and delete it
    console.log('Checking for existing About page...');
    
    try {
      const checkResponse = await fetch('http://localhost:3001/api/pages/cmfbkuqkm003yan2u7r9cspd6', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Deleted existing page if it existed:', checkResponse.status);
    } catch (e) {
      console.log('No existing page to delete or deletion failed - proceeding with creation');
    }

    // Create the About page
    console.log('Creating About page in admin...');
    
    const createResponse = await fetch('http://localhost:3001/api/pages', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aboutPageData)
    });

    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('✅ About page created successfully in admin!');
      console.log('   Page ID:', result.data?.id);
      console.log('   Title:', result.data?.title);
      console.log('   Status:', result.data?.status);
      console.log('   Blocks:', result.data?.blocks?.length || 0);
      console.log('   Edit URL: http://localhost:3001/admin/pages/' + result.data?.id + '/edit');
    } else {
      const error = await createResponse.json();
      console.error('❌ Failed to create About page:', createResponse.status, error);
    }
  } catch (error) {
    console.error('❌ Error creating About page:', error.message);
  }
}

createAboutPageInAdmin();