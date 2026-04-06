import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Use direct Postgres URL for seeding (bypasses prisma+postgres proxy)
const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const EP_SUMMARIES: Record<string, string> = {
  kbi: `Executive Presence is a specialized B2B services firm that helps executives and organizations build trust, visibility, and influence through authentic thought leadership on LinkedIn. You currently support approximately 47 active clients across three business models: EP 1.0 (individual executive programs), CoCreate (a lower-touch hybrid), and a small but strategically important set of EP 2.0 multi-executive engagements.

Your current positioning around "LinkedIn content for executives" has built the business to roughly $200K in MRR, but has exposed structural issues: tight margins, consistent churn, and an inconsistent pipeline. Most individual executive clients struggle to see attributable ROI, and when a CMO reprioritizes, these one-off relationships churn.

The goal of this engagement is to reposition Executive Presence from a partner to individual executives toward an organizational brand partner supporting the entire go-to-market function — reducing churn and improving revenue quality by shifting from one-off executives to embedded, organization-wide partnerships.`,

  icp_alignment: `The ideal target client for Executive Presence 2.0 is a growth-stage B2B company where leadership credibility shapes market perception and market perception is necessary for growth. These are companies with $20M or more in annual revenue, 50 to 2,000+ employees, in industries like IT services, professional services, finance, managed services, and technology-enabled businesses.

The right client has a real point of view worth amplifying and a CEO who is willing to put it to work. They are not looking for a posting service — they want a partner who will push back on weak ideas, extract what's actually worth saying, and connect it to how the rest of the business operates. Inflection points such as recent acquisitions, PE backing, or upcoming liquidity events are strong buying signals.`,

  comp_analysis: `The executive visibility market is expanding rapidly — the ghostwriting industry alone has grown from $1.55B in 2021 to $2.05B in 2025. This growth has lowered the barrier to producing polished content without solving the deeper challenge: building real executive credibility that connects back to business outcomes.

The competitive landscape is fragmented across content agencies, ghostwriters, PR firms, brand consultants, and sales-focused social selling firms. Most serve individual executives, not leadership teams. No major competitor offers a coordinated, cross-executive visibility system — this leaves a clear gap at the organizational level, exactly where Executive Presence 2.0 is positioned to compete.

When companies don't work with Executive Presence, they typically rely on PR firms that fold LinkedIn into a broader engagement (losing platform focus), internal marketing teams that add LinkedIn to existing responsibilities (no dedicated strategy), AI tools combined with DIY effort, or playbook agencies that promise a system and a schedule (volume over substance).`,

  positioning_options: `Three strategic directions were evaluated for how Executive Presence transitions from EP 1.0 to EP 2.0. Option A uses catalytic business moments (fundraising, launches, exits) as the wedge into organizational coordination. Option B builds a full communication foundation framework that extends beyond LinkedIn. Option C leads with CEO-only at a premium price point and adds executives over time.

Each option was assessed on its target buyer, qualifying criteria, deal-breaker scenarios, pricing model, and competitive defensibility. The core tension across all three: the entry strategy must get Executive Presence to organizational coordination without trapping it back in individual executive services — which is what killed the 1.0 model.`,

  positioning_guide: `Executive Presence chose Direction A: the LinkedIn-native intelligence partner. This positions EP as the company that turns what executives say on LinkedIn into an intelligence engine that informs go-to-market decisions — not a content production service.

The positioning rests on two defensible pillars. First, the Market Intelligence Loop: EP tracks what resonates on LinkedIn and translates that signal into intelligence that informs GTM messaging, recruiting narratives, investor conversations, and sales language. Internal marketing stops treating EP as a content vendor and starts looking to it for signal. Second, the Diagnostic as Step One: every engagement begins with deep-dive interviews that surface what the executive actually believes and what they want to be known for — confirming substance exists before committing to amplify it.

This is the strategic gate for your entire engagement. Your target personas, brand story, messaging playbook, and GTM plan all build directly on this decision. Any revision to this positioning requires review of every downstream deliverable.`,

  target_personas: `We've defined two distinct buyer personas that will guide your go-to-market strategy, building directly on your Positioning Guide and ICP alignment work. These personas represent the CEOs most likely to invest in executive presence services, each with fundamentally different motivations and decision-making processes.

The Platform Builder is your enterprise segment — CEOs of $100M+ companies built through acquisition who are preparing for liquidity events. They're already active on LinkedIn organically but lack systematic amplification. The Scale-Up Strategist represents your growth segment — CEOs of $20-100M companies that are post-acquisition or PE-backed. They're managing integration pressures while trying to maintain market presence through small, overwhelmed marketing teams.

The critical insight is that these personas have opposite tolerance for risk and different entry points. Platform Builders will pay premium prices without negotiation if convinced of value, but they demand mutual evaluation and bi-directional feedback. Scale-Up Strategists operate in the $5-10K comfort zone and need upfront strategic work to prove value before committing to ongoing retainers.`,
};

const NODE_TEMPLATES = [
  // Node 1: KBI
  { nodeKey: "kbi", sectionKey: "company_overview", sectionTitle: "Company Overview", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "Who they are, what they do, current state" },
  { nodeKey: "kbi", sectionKey: "company_goals", sectionTitle: "Company Goals", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: "What they're trying to achieve" },
  { nodeKey: "kbi", sectionKey: "situation_analysis", sectionTitle: "Situation Analysis", sortOrder: 3, displayLayer: "CHAPTER" as const, isRequired: true, description: "OTM's preliminary read — framed as initial assessment subject to downstream validation" },
  { nodeKey: "kbi", sectionKey: "services_approach", sectionTitle: "Services & Current Approach", sortOrder: 4, displayLayer: "FULL" as const, isRequired: true, description: "Descriptive, not analytical" },
  { nodeKey: "kbi", sectionKey: "preliminary_differentiators", sectionTitle: "Preliminary Differentiators", sortOrder: 5, displayLayer: "FULL" as const, isRequired: true, description: "Client's claimed differentiators, captured as-stated without competitive assessment" },
  { nodeKey: "kbi", sectionKey: "current_buyer_profile", sectionTitle: "Current Buyer Profile", sortOrder: 6, displayLayer: "FULL" as const, isRequired: true, description: "Who they sell to today as the client describes it — not a validated ICP" },
  { nodeKey: "kbi", sectionKey: "sales_process", sectionTitle: "Sales Process & Friction Points", sortOrder: 7, displayLayer: "FULL" as const, isRequired: true, description: "How they sell today, what breaks" },
  { nodeKey: "kbi", sectionKey: "named_competitors", sectionTitle: "Named Competitors", sortOrder: 8, displayLayer: "FULL" as const, isRequired: true, description: "Listed, not analyzed — analysis is Comp Analysis's job" },
  { nodeKey: "kbi", sectionKey: "marketing_audit", sectionTitle: "Current Marketing Audit", sortOrder: 9, displayLayer: "FULL" as const, isRequired: true, description: "Descriptive inventory of what exists" },
  { nodeKey: "kbi", sectionKey: "additional_research", sectionTitle: "Additional Research", sortOrder: 10, displayLayer: "FULL" as const, isRequired: false, description: "Supplementary context, varies by engagement" },

  // Node 2: ICP Alignment (conditional)
  { nodeKey: "icp_alignment", sectionKey: "validation_summary", sectionTitle: "Validation Summary", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "What interviews confirmed, challenged, or changed about preliminary ICP" },
  { nodeKey: "icp_alignment", sectionKey: "revised_icp", sectionTitle: "Revised ICP Recommendation", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: false, description: "Only present if ICP changed based on findings" },
  { nodeKey: "icp_alignment", sectionKey: "key_findings", sectionTitle: "Key Findings by Theme", sortOrder: 3, displayLayer: "FULL" as const, isRequired: true, description: "Organized around the questions interviews were designed to answer" },
  { nodeKey: "icp_alignment", sectionKey: "interview_methodology", sectionTitle: "Interview Methodology", sortOrder: 4, displayLayer: "FULL" as const, isRequired: true, description: "Who was interviewed, what was asked, how findings were synthesized" },
  { nodeKey: "icp_alignment", sectionKey: "interview_analyses", sectionTitle: "Interview Analyses", sortOrder: 5, displayLayer: "FULL" as const, isRequired: false, description: "Individual interview writeups" },

  // Node 3: Comp Analysis
  { nodeKey: "comp_analysis", sectionKey: "market_context", sectionTitle: "Market Context", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "What's happening in the market — trends, sizing, dynamics" },
  { nodeKey: "comp_analysis", sectionKey: "competitive_landscape", sectionTitle: "Competitive Landscape Overview", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: "How the market is structured, categories of competitors" },
  { nodeKey: "comp_analysis", sectionKey: "differentiation_assessment", sectionTitle: "Differentiation Assessment", sortOrder: 3, displayLayer: "CHAPTER" as const, isRequired: true, description: "KBI's preliminary differentiators stress-tested against competitive reality" },
  { nodeKey: "comp_analysis", sectionKey: "competitive_whitespace", sectionTitle: "Competitive Whitespace", sortOrder: 4, displayLayer: "CHAPTER" as const, isRequired: true, description: "Where the gaps are — what no competitor owns. Ends here. No positioning recommendation." },
  { nodeKey: "comp_analysis", sectionKey: "brand_naming", sectionTitle: "Brand Naming & Discoverability", sortOrder: 5, displayLayer: "CHAPTER" as const, isRequired: false, description: "If applicable" },
  { nodeKey: "comp_analysis", sectionKey: "competitor_deep_dives", sectionTitle: "Competitor Deep Dives", sortOrder: 6, displayLayer: "FULL" as const, isRequired: true, description: "Individual competitor teardowns" },
  { nodeKey: "comp_analysis", sectionKey: "pricing_benchmarks", sectionTitle: "Pricing Benchmarks", sortOrder: 7, displayLayer: "FULL" as const, isRequired: true, description: "Market pricing data" },
  { nodeKey: "comp_analysis", sectionKey: "market_data", sectionTitle: "Market Data & Sources", sortOrder: 8, displayLayer: "FULL" as const, isRequired: false, description: "Third-party data, sentiment research" },

  // Node 4: Positioning Options
  { nodeKey: "positioning_options", sectionKey: "core_question", sectionTitle: "The Core Question", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "Frames the strategic decision using whitespace and ICP as inputs" },
  { nodeKey: "positioning_options", sectionKey: "strategic_comparison", sectionTitle: "Strategic Comparison", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: "Side-by-side on key dimensions" },
  { nodeKey: "positioning_options", sectionKey: "recommendation", sectionTitle: "Recommendation & Decision Criteria", sortOrder: 3, displayLayer: "CHAPTER" as const, isRequired: true, description: "OTM's perspective plus decision criteria" },
  { nodeKey: "positioning_options", sectionKey: "option_a", sectionTitle: "Option A", sortOrder: 4, displayLayer: "FULL" as const, isRequired: true, description: "Full option: Who & When, The Bet, Differentiation, What You Need to Win, Deal Breakers, Business Model" },
  { nodeKey: "positioning_options", sectionKey: "option_b", sectionTitle: "Option B", sortOrder: 5, displayLayer: "FULL" as const, isRequired: true, description: "Same structure as Option A" },
  { nodeKey: "positioning_options", sectionKey: "option_c", sectionTitle: "Option C", sortOrder: 6, displayLayer: "FULL" as const, isRequired: false, description: "Same structure, when applicable" },

  // Node 5: Positioning Guide (GATE — all CHAPTER)
  { nodeKey: "positioning_guide", sectionKey: "target_client", sectionTitle: "Target Client Definition", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "positioning_guide", sectionKey: "problem_solved", sectionTitle: "Problem We Solve", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "positioning_guide", sectionKey: "competitive_alternatives", sectionTitle: "Competitive Alternatives", sortOrder: 3, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "positioning_guide", sectionKey: "market_category", sectionTitle: "Market Category", sortOrder: 4, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "positioning_guide", sectionKey: "positioning_statement", sectionTitle: "Positioning Statement", sortOrder: 5, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "positioning_guide", sectionKey: "core_differentiators", sectionTitle: "Core Differentiators", sortOrder: 6, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "positioning_guide", sectionKey: "content_themes", sectionTitle: "Content Themes", sortOrder: 7, displayLayer: "CHAPTER" as const, isRequired: true, description: null },

  // Node 6: Target Personas
  { nodeKey: "target_personas", sectionKey: "persona_overview", sectionTitle: "Persona Overview", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "How many personas, what differentiates them structurally" },
  { nodeKey: "target_personas", sectionKey: "icp_firmographics", sectionTitle: "ICP Firmographic Criteria", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: "Inherited — one table, explicitly labeled as carried forward from ICP Alignment / KBI" },
  { nodeKey: "target_personas", sectionKey: "key_attributes", sectionTitle: "Ideal Client Key Attributes", sortOrder: 3, displayLayer: "CHAPTER" as const, isRequired: true, description: "Qualitative: beliefs, values, fit signals" },
  { nodeKey: "target_personas", sectionKey: "persona_1_summary", sectionTitle: "Persona 1 Summary", sortOrder: 4, displayLayer: "CHAPTER" as const, isRequired: true, description: "Compact: who they are, what they need, how they buy" },
  { nodeKey: "target_personas", sectionKey: "persona_2_summary", sectionTitle: "Persona 2 Summary", sortOrder: 5, displayLayer: "CHAPTER" as const, isRequired: false, description: "Same structure" },
  { nodeKey: "target_personas", sectionKey: "exclusion_criteria", sectionTitle: "Who We Should Not Target", sortOrder: 6, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "target_personas", sectionKey: "persona_1_canvas", sectionTitle: "Persona 1 Full Canvas", sortOrder: 7, displayLayer: "FULL" as const, isRequired: true, description: "Demographics, org context, current state, goals, pain points, success metrics, buying committee, decision pattern" },
  { nodeKey: "target_personas", sectionKey: "persona_2_canvas", sectionTitle: "Persona 2 Full Canvas", sortOrder: 8, displayLayer: "FULL" as const, isRequired: false, description: "Same structure" },
  { nodeKey: "target_personas", sectionKey: "reference_profiles", sectionTitle: "Reference Client Profiles", sortOrder: 9, displayLayer: "FULL" as const, isRequired: false, description: "Real companies analyzed against ICP" },

  // Node 7: Offer Architecture (conditional)
  { nodeKey: "offer_architecture", sectionKey: "service_architecture", sectionTitle: "Service Architecture", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "Tiers, anchor, add-ons — the structure itself" },
  { nodeKey: "offer_architecture", sectionKey: "pricing_model", sectionTitle: "Pricing Model", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: "Logic, ranges, benchmarks" },
  { nodeKey: "offer_architecture", sectionKey: "packaging_rationale", sectionTitle: "Packaging Rationale", sortOrder: 3, displayLayer: "FULL" as const, isRequired: true, description: "Why this structure serves the ICP and positioning" },
  { nodeKey: "offer_architecture", sectionKey: "service_descriptions", sectionTitle: "Detailed Service Descriptions", sortOrder: 4, displayLayer: "FULL" as const, isRequired: true, description: "Scope per tier/package" },

  // Node 8: Brand Story (all CHAPTER)
  { nodeKey: "brand_story", sectionKey: "brand_story_framework", sectionTitle: "Brand Story Framework", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "7-Part Story: Character/Want → Problem → Guide → Plan → CTA → Success → Failure → Transformation" },
  { nodeKey: "brand_story", sectionKey: "one_liner", sectionTitle: "One-Liner", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "brand_story", sectionKey: "positioning_statement_ref", sectionTitle: "Positioning Statement", sortOrder: 3, displayLayer: "CHAPTER" as const, isRequired: true, description: "Inherited — labeled as from Positioning Guide" },

  // Node 9: Messaging Playbook
  { nodeKey: "messaging_playbook", sectionKey: "one_page_summary", sectionTitle: "One-Page Messaging Summary", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "The entire playbook compressed to one page" },
  { nodeKey: "messaging_playbook", sectionKey: "messaging_house", sectionTitle: "Messaging House", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: "The five pillars — structural bridge between brand story and operational language" },
  { nodeKey: "messaging_playbook", sectionKey: "tone_voice", sectionTitle: "Tone & Voice Guide", sortOrder: 3, displayLayer: "CHAPTER" as const, isRequired: true, description: null },
  { nodeKey: "messaging_playbook", sectionKey: "buying_committee_guide", sectionTitle: "Buying Committee Language Guide", sortOrder: 4, displayLayer: "FULL" as const, isRequired: true, description: "Per role: key message, proof needs, objection response" },
  { nodeKey: "messaging_playbook", sectionKey: "funnel_language_system", sectionTitle: "Funnel Language System", sortOrder: 5, displayLayer: "FULL" as const, isRequired: true, description: "Assets mapped to persona × funnel stage with copy frameworks" },
  { nodeKey: "messaging_playbook", sectionKey: "sales_language_library", sectionTitle: "Sales Language Library", sortOrder: 6, displayLayer: "FULL" as const, isRequired: true, description: "Objection handling scripts, framing by persona" },

  // Node 10: GTM Plan
  { nodeKey: "gtm_plan", sectionKey: "executive_overview", sectionTitle: "Executive Overview", sortOrder: 1, displayLayer: "CHAPTER" as const, isRequired: true, description: "What's being done, why, how success is measured" },
  { nodeKey: "gtm_plan", sectionKey: "performance_signals", sectionTitle: "Performance Signals & Exit Criteria", sortOrder: 2, displayLayer: "CHAPTER" as const, isRequired: true, description: "What to measure at 90 days, 6 months — when to advance phases" },
  { nodeKey: "gtm_plan", sectionKey: "system_architecture", sectionTitle: "System Architecture", sortOrder: 3, displayLayer: "CHAPTER" as const, isRequired: true, description: "How channels work together — the compound effect" },
  { nodeKey: "gtm_plan", sectionKey: "phase_1_activation", sectionTitle: "Phase 1 Activation Plan", sortOrder: 4, displayLayer: "FULL" as const, isRequired: true, description: "Foundational projects, top/mid/bottom of funnel activations with copy, cadences, budgets" },
  { nodeKey: "gtm_plan", sectionKey: "phase_2_scale", sectionTitle: "Phase 2: Scale What Works", sortOrder: 5, displayLayer: "FULL" as const, isRequired: true, description: "Post-validation expansion" },
  { nodeKey: "gtm_plan", sectionKey: "execution_roadmap", sectionTitle: "Execution Roadmap", sortOrder: 6, displayLayer: "FULL" as const, isRequired: true, description: "Week-by-week execution plan" },
];

// Section content for completed nodes — maps nodeKey to sectionKey -> content
const EP_SECTIONS: Record<string, Record<string, string>> = {
  kbi: {
    company_overview: `Executive Presence is a specialized B2B services firm that helps executives and organizations build trust, visibility, and influence through authentic thought leadership on LinkedIn. The company currently supports approximately 47 active clients across three business models: EP 1.0 (individual executive programs), CoCreate (a lower-touch hybrid), and a small but strategically important set of EP 2.0 multi-executive engagements.`,
    company_goals: `The goal of this engagement is to reposition Executive Presence from a partner to individual executives toward an organizational brand partner supporting the entire go-to-market function — reducing churn and improving revenue quality by shifting from one-off executives to embedded, organization-wide partnerships.`,
    situation_analysis: `Current positioning around "LinkedIn content for executives" has built the business to roughly $200K in MRR, but has exposed structural issues: tight margins, consistent churn, and an inconsistent pipeline. Most individual executive clients struggle to see attributable ROI, and when a CMO reprioritizes, these one-off relationships churn.\n\nThe transition from EP 1.0 to EP 2.0 represents a fundamental shift in business model — from individual service delivery to organizational partnership. This requires not just new positioning but a reimagined service architecture, pricing model, and go-to-market approach.`,
    services_approach: `Three current service tiers:\n\n- **EP 1.0** — Individual executive LinkedIn programs. Core offering, highest volume, but highest churn.\n- **CoCreate** — Lower-touch hybrid model. Designed for scale but unclear differentiation from 1.0.\n- **EP 2.0** — Multi-executive organizational engagements. Small portfolio but strategically critical — this is the future direction.`,
    preliminary_differentiators: `Client-stated differentiators:\n\n- Deep interview process that surfaces authentic executive voice\n- Focus on substance over volume — "we don't post to post"\n- LinkedIn platform specialization vs. generalist agencies\n- Strategic approach connecting executive visibility to business outcomes`,
    current_buyer_profile: `Current buyers are primarily individual executives — CEOs, founders, and C-suite leaders at B2B companies ranging from growth-stage to enterprise. Most find EP through referrals or LinkedIn itself. The buying decision is typically made by the individual executive, sometimes with CMO involvement for budget approval.`,
    sales_process: `Sales process is primarily referral-driven with some inbound from LinkedIn presence. Key friction points:\n\n- Long sales cycles for enterprise deals\n- Individual executives make emotional buying decisions that churn when priorities shift\n- No systematic qualification process — many deals close that shouldn't\n- Pricing conversations happen too late in the process`,
    named_competitors: `Key competitors identified:\n\n- Content agencies (ghostwriters, content mills)\n- PR firms with LinkedIn bolt-on services\n- Social selling platforms and training companies\n- Brand consultancies with executive visibility practices\n- DIY tools (AI writing assistants, scheduling platforms)`,
    marketing_audit: `Current marketing consists primarily of the founders' own LinkedIn presence, which serves as both proof-of-concept and lead generation. Website exists but is not optimized for the EP 2.0 positioning. No systematic content marketing, email nurture, or paid acquisition. Case studies exist informally but are not packaged for sales enablement.`,
  },
  icp_alignment: {
    validation_summary: `Interviews confirmed that the highest-value buyers are not individual executives seeking personal brand help — they are CEOs of growth-stage and mid-market B2B companies who see executive visibility as an organizational capability, not a vanity project.\n\nThe preliminary ICP from KBI was directionally correct but underweighted two critical factors: the role of inflection points (M&A, PE events, leadership transitions) as buying triggers, and the importance of CEO willingness to receive strategic pushback as a qualifying criterion.`,
    revised_icp: `**Revised ICP:** B2B companies with $20M+ annual revenue, 50-2,000+ employees, in industries where leadership credibility shapes market perception. Must be at or approaching an inflection point. CEO must demonstrate willingness to be challenged on messaging and positioning — this is the single strongest predictor of engagement success and retention.`,
    key_findings: `**Theme 1: Inflection Points Drive Urgency**\nCompanies actively buy executive visibility services when something forces them to care — fundraising, acquisition integration, competitive threat, or leadership transition. Without an inflection point, executive LinkedIn is "nice to have" and churns.\n\n**Theme 2: CEO Coachability is the #1 Success Predictor**\nThe executives who get the most value are those who treat EP as a strategic partner, not a content vendor. Interviews consistently showed that clients who pushed back on EP's recommendations had worse outcomes than those who leaned in.\n\n**Theme 3: Organizational Buy-In Matters More Than Individual Enthusiasm**\nWhen only one executive is engaged, the program is fragile. When the organization sees executive visibility as a GTM function, retention and expansion are dramatically higher.`,
    interview_methodology: `Conducted 12 semi-structured interviews across three cohorts: current EP 1.0 clients (5), churned clients (4), and prospects who evaluated but didn't buy (3). Interviews lasted 45-60 minutes and covered buying motivations, decision criteria, perceived value, and reasons for churn or non-purchase.`,
  },
  comp_analysis: {
    market_context: `The executive visibility market is expanding rapidly — the ghostwriting industry alone has grown from $1.55B in 2021 to $2.05B in 2025. This growth has lowered the barrier to producing polished content without solving the deeper challenge: building real executive credibility that connects back to business outcomes.\n\nThe market is bifurcating: commoditized content production on one end, strategic advisory on the other. The middle — "good content at fair prices" — is being squeezed by AI tools and offshore writers.`,
    competitive_landscape: `The competitive landscape is fragmented across five categories:\n\n1. **Content agencies and ghostwriters** — Volume-focused, primarily individual service\n2. **PR firms** — LinkedIn as one channel among many, not platform-native\n3. **Social selling platforms** — Training and tools, not done-for-you\n4. **Brand consultancies** — Strategic but rarely execute on LinkedIn\n5. **DIY tools** — AI writing assistants, scheduling, analytics`,
    differentiation_assessment: `EP's claimed differentiators tested against competitive reality:\n\n- **Deep interview process**: Validated — no competitor invests comparable time in executive voice extraction. This is genuinely defensible.\n- **Substance over volume**: Partially validated — several competitors make similar claims, but EP's diagnostic-first model backs it up.\n- **LinkedIn specialization**: Double-edged — provides depth but limits perceived scope for organizational buyers.\n- **Business outcome focus**: Aspirational — EP doesn't yet have the measurement infrastructure to prove this consistently.`,
    competitive_whitespace: `Clear whitespace exists at the intersection of three capabilities no competitor currently combines:\n\n1. **Organizational coordination** — managing multiple executives' LinkedIn presence as a unified system\n2. **Intelligence extraction** — turning LinkedIn engagement data into GTM insights\n3. **Strategic advisory** — pushing back on executives' instincts with data-informed recommendations\n\nThe gap is not in any single capability but in their combination. Individual competitors excel at one; none deliver all three.`,
    competitor_deep_dives: `**Ghostwrite.ai** — AI-first content generation. Fast, cheap, no strategic layer. Targets individuals.\n\n**The Thought Leadership Agency** — UK-based, strong strategic positioning but limited LinkedIn execution. Serves enterprises.\n\n**Social Factor** — LinkedIn-focused agency, closest direct competitor. Strong execution but lacks EP's diagnostic depth. Primarily individual service.\n\n**Influence & Co** — Content marketing agency with executive ghostwriting. Broader scope dilutes LinkedIn focus.\n\n**Internal Marketing Teams** — The most common "competitor." LinkedIn added to existing responsibilities with no dedicated strategy or accountability.`,
    pricing_benchmarks: `Market pricing ranges:\n\n- Individual ghostwriting: $1,500-5,000/month\n- Executive LinkedIn management: $3,000-8,000/month\n- Organizational programs (rare): $15,000-40,000/month\n- PR firms with LinkedIn: $8,000-25,000/month (LinkedIn is 10-20% of scope)\n\nEP's current pricing ($3,000-7,000 for EP 1.0) is mid-market for individual service. EP 2.0 organizational pricing has no established benchmark — this is an advantage.`,
  },
  positioning_options: {
    core_question: `The core strategic question: **How does Executive Presence transition from EP 1.0 (individual executive LinkedIn service) to EP 2.0 (organizational visibility partner) without getting trapped back in the individual service model that created the churn problem?**\n\nThe whitespace identified in Competitive Analysis — the intersection of organizational coordination, intelligence extraction, and strategic advisory — provides the territory. The question is which entry strategy captures it most effectively.`,
    strategic_comparison: `| Dimension | Option A: Catalytic Moments | Option B: Communication Foundation | Option C: CEO-First Premium |\n|---|---|---|---|\n| Entry point | Business inflection events | Full communication framework | CEO-only at premium price |\n| Risk | Timing-dependent pipeline | Scope creep beyond LinkedIn | Reverts to individual model |\n| Pricing | Event-triggered premium | Retainer-based | High individual, expand later |\n| Competitive defense | Unique trigger-based positioning | Broad but harder to defend | Premium brand, thin moat |`,
    recommendation: `**OTM recommends Option A: Catalytic Moments** as the primary entry strategy.\n\nOption A creates the strongest structural defense against reverting to EP 1.0 because it qualifies on organizational need (the inflection point) rather than individual desire. It naturally leads to multi-executive coordination because the events that trigger purchase (M&A, fundraising, leadership transitions) inherently involve multiple stakeholders.\n\nDecision criteria that favor Option A: Do your best clients come through inflection points? (Yes.) Does the sales cycle shorten when there's urgency? (Yes.) Can you qualify out faster when there's no trigger? (Yes.)`,
    option_a: `**Option A: Catalytic Moments — The LinkedIn-Native Intelligence Partner**\n\n**Who & When:** B2B companies at inflection points — post-acquisition, PE-backed growth, leadership transitions, competitive threats. $20M+ revenue, CEO willing to be coached.\n\n**The Bet:** Companies buy executive visibility when something forces them to care. If EP can be the partner they call at that moment, it enters at the organizational level by default.\n\n**Differentiation:** No competitor positions around business inflection points as buying triggers. This creates a category of one.\n\n**What You Need to Win:** A diagnostic that surfaces whether the inflection point creates genuine need. Sales process that qualifies on organizational readiness, not individual enthusiasm.\n\n**Deal Breakers:** CEO unwilling to be coached. No genuine inflection point (just "we should probably do LinkedIn"). Marketing team that wants to control messaging without executive input.\n\n**Business Model:** Diagnostic engagement ($15-25K) → ongoing organizational program ($8-15K/month per executive, 3+ executive minimum).`,
    option_b: `**Option B: Communication Foundation Framework**\n\n**Who & When:** Same ICP but broader trigger — any company that recognizes communication fragmentation as a growth bottleneck.\n\n**The Bet:** EP becomes the communication infrastructure partner, extending beyond LinkedIn into internal communications, investor relations, and sales enablement.\n\n**Differentiation:** Broader scope creates stickier relationships but dilutes LinkedIn expertise positioning.\n\n**What You Need to Win:** Capabilities beyond LinkedIn content — communication audits, messaging architecture, multi-channel orchestration.\n\n**Deal Breakers:** Requires significant capability expansion. Risk of competing with established communication consultancies.\n\n**Business Model:** Foundation audit ($20-35K) → ongoing retainer ($12-20K/month) → expansion into additional communication channels.`,
  },
  positioning_guide: {
    target_client: `B2B companies with $20M+ annual revenue, 50-2,000+ employees, at or approaching a business inflection point. Industries where leadership credibility shapes market perception: IT services, professional services, finance, managed services, and technology-enabled businesses.`,
    problem_solved: `When companies hit inflection points — acquisitions, PE events, competitive threats, leadership transitions — their executives' market presence becomes a strategic asset or a strategic liability. Most companies have no systematic way to turn executive visibility into business intelligence and market advantage.`,
    competitive_alternatives: `When companies don't work with Executive Presence, they typically:\n- Hire a PR firm that folds LinkedIn into a broader engagement (losing platform focus)\n- Assign it to internal marketing (no dedicated strategy)\n- Use AI tools + DIY effort (volume without substance)\n- Hire a ghostwriter (content without strategy)\n- Do nothing and hope the market figures out who they are`,
    market_category: `LinkedIn-native executive intelligence partner. Not a content agency. Not a ghostwriting service. Not a PR firm. A strategic partner that turns what executives say on LinkedIn into intelligence that informs go-to-market decisions.`,
    positioning_statement: `For growth-stage and mid-market B2B companies at business inflection points, Executive Presence is the LinkedIn-native intelligence partner that turns executive visibility into organizational advantage — providing the diagnostic depth, strategic advisory, and cross-executive coordination that no content agency, PR firm, or DIY approach can deliver.`,
    core_differentiators: `1. **The Diagnostic** — Every engagement begins with deep-dive interviews that surface what the executive actually believes and confirm substance exists before committing to amplify it\n2. **The Market Intelligence Loop** — EP tracks what resonates on LinkedIn and translates signal into GTM intelligence\n3. **Organizational Coordination** — Not individual executives posting in isolation, but a unified leadership voice architecture`,
    content_themes: `1. The Executive Visibility Gap — why most B2B companies have one and what it costs them\n2. Inflection Points as Visibility Moments — the connection between business events and market presence\n3. Intelligence Over Content — why what resonates matters more than what's published\n4. The Coordinated Voice — why organizational visibility beats individual posting`,
  },
};

const NODE_CONFIGS = [
  { nodeKey: "kbi", displayName: "Key Business Information", sortOrder: 1, isGate: false, isConditional: false, status: "complete" as const, dependsOn: [] },
  { nodeKey: "icp_alignment", displayName: "ICP Alignment", sortOrder: 2, isGate: false, isConditional: true, status: "complete" as const, dependsOn: ["kbi"] },
  { nodeKey: "comp_analysis", displayName: "Competitive Analysis", sortOrder: 3, isGate: false, isConditional: false, status: "complete" as const, dependsOn: ["kbi"] },
  { nodeKey: "positioning_options", displayName: "Positioning Options", sortOrder: 4, isGate: false, isConditional: false, status: "complete" as const, dependsOn: ["kbi", "icp_alignment", "comp_analysis"] },
  { nodeKey: "positioning_guide", displayName: "Positioning Guide", sortOrder: 5, isGate: true, isConditional: false, status: "complete" as const, dependsOn: ["positioning_options"] },
  { nodeKey: "target_personas", displayName: "Target Personas", sortOrder: 6, isGate: false, isConditional: false, status: "active" as const, dependsOn: ["positioning_guide", "icp_alignment"] },
  { nodeKey: "offer_architecture", displayName: "Offer Architecture", sortOrder: 7, isGate: false, isConditional: true, status: "locked" as const, dependsOn: ["positioning_guide", "target_personas"] },
  { nodeKey: "brand_story", displayName: "Brand Story", sortOrder: 8, isGate: false, isConditional: false, status: "locked" as const, dependsOn: ["positioning_guide", "target_personas"] },
  { nodeKey: "messaging_playbook", displayName: "Messaging Playbook", sortOrder: 9, isGate: false, isConditional: false, status: "locked" as const, dependsOn: ["brand_story"] },
  { nodeKey: "gtm_plan", displayName: "GTM Plan", sortOrder: 10, isGate: false, isConditional: false, status: "locked" as const, dependsOn: ["messaging_playbook", "offer_architecture"] },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.cascadeFlag.deleteMany();
  await prisma.nodeSection.deleteMany();
  await prisma.nodeVersion.deleteMany();
  await prisma.nodeDependency.deleteMany();
  await prisma.node.deleteMany();
  await prisma.nodeTemplate.deleteMany();
  await prisma.engagementUser.deleteMany();
  await prisma.engagement.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminHash = await bcrypt.hash("admin123", 12);
  const clientHash = await bcrypt.hash("client123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@meetotm.com",
      name: "OTM Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const client = await prisma.user.create({
    data: {
      email: "client@example.com",
      name: "Justin MyCo",
      passwordHash: clientHash,
      role: "CLIENT",
    },
  });

  // Create engagement
  const engagement = await prisma.engagement.create({
    data: {
      clientName: "Executive Presence",
      lifecycleStage: "Traction",
    },
  });

  // Link users to engagement
  await prisma.engagementUser.createMany({
    data: [
      { userId: admin.id, engagementId: engagement.id },
      { userId: client.id, engagementId: engagement.id },
    ],
  });

  // Create nodes
  const nodeMap = new Map<string, string>(); // nodeKey -> nodeId

  for (const config of NODE_CONFIGS) {
    const node = await prisma.node.create({
      data: {
        engagementId: engagement.id,
        nodeKey: config.nodeKey,
        displayName: config.displayName,
        sortOrder: config.sortOrder,
        isGate: config.isGate,
        isConditional: config.isConditional,
        status: config.status,
      },
    });
    nodeMap.set(config.nodeKey, node.id);

    // Create initial version with exec summary if complete
    const summary = EP_SUMMARIES[config.nodeKey];
    if (summary) {
      const version = await prisma.nodeVersion.create({
        data: {
          nodeId: node.id,
          versionNumber: 1,
          execSummary: summary,
          isCurrent: true,
          isBaseline: true,
        },
      });

      // Create sections if section content exists for this node
      const sectionContent = EP_SECTIONS[config.nodeKey];
      if (sectionContent) {
        const templates = NODE_TEMPLATES.filter((t) => t.nodeKey === config.nodeKey);
        for (const template of templates) {
          const content = sectionContent[template.sectionKey];
          if (content) {
            await prisma.nodeSection.create({
              data: {
                nodeVersionId: version.id,
                sectionKey: template.sectionKey,
                sectionTitle: template.sectionTitle,
                content,
                sortOrder: template.sortOrder,
                displayLayer: template.displayLayer,
              },
            });
          }
        }
      }
    }
  }

  // Create dependencies
  for (const config of NODE_CONFIGS) {
    const nodeId = nodeMap.get(config.nodeKey)!;
    for (const depKey of config.dependsOn) {
      const depId = nodeMap.get(depKey)!;
      await prisma.nodeDependency.create({
        data: {
          nodeId,
          dependsOnNodeId: depId,
        },
      });
    }
  }

  // Seed node templates
  for (const t of NODE_TEMPLATES) {
    await prisma.nodeTemplate.create({ data: t });
  }

  console.log("Seeded:");
  console.log(`  - 2 users (admin@meetotm.com / admin123, client@example.com / client123)`);
  console.log(`  - 1 engagement (Executive Presence)`);
  console.log(`  - 10 nodes with dependencies`);
  console.log(`  - ${Object.keys(EP_SUMMARIES).length} node versions with exec summaries`);
  console.log(`  - ${NODE_TEMPLATES.length} node templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
