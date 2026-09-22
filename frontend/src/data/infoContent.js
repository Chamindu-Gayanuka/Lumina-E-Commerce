export const INFO_PAGES = {
    "our-story": {
        title: "Our Story",
        intro:
            "Lumina began in 2021 as a two-person electronics repair shop in Negombo. Today we are an island-wide marketplace connecting careful shoppers with trusted Sri Lankan sellers.",
        blocks: [
            {
                type: "paragraphs",
                text: [
                    "It started with a simple frustration: good local products were hard to find online, and the big marketplaces treated small sellers like an afterthought. So we built Lumina the way we would want to shop ourselves — curated listings, honest pricing, real photos, and a seller you can actually message.",
                    "Every product on Lumina is listed by an approved seller and stocked locally. No drop-shipping roulette, no six-week wait from overseas. When you order, your seller packs it, our fulfilment partners deliver it, and you pay at your door.",
                ],
            },
            {
                type: "stats",
                items: [
                    {value: "50k+", label: "Orders delivered"},
                    {value: "120", label: "Approved sellers"},
                    {value: "25", label: "Districts covered"},
                    {value: "4.8", label: "Average store rating"},
                ],
            },
            {
                type: "bullets",
                title: "What we stand for",
                items: [
                    {
                        label: "Curated quality",
                        text: "Every seller is reviewed and approved before their store opens. Every listing is checked against our image and description standards."
                    },
                    {
                        label: "Honest pricing",
                        text: "Rs. prices, no hidden fees, no fake countdown timers. Cash on delivery means you only pay when the box is in your hands."
                    },
                    {
                        label: "Local first",
                        text: "We prioritise Sri Lankan makers and importers — from Negombo ceramics to Colombo audio gear."
                    },
                    {
                        label: "Seller success",
                        text: "Sellers get real tools: inventory controls, order management, and sales analytics that are free to use."
                    },
                ],
            },
            {
                type: "paragraphs",
                title: "The road so far",
                text: [
                    "2021 — The repair shop. Two benches, one website, and a promise to only sell what we would use ourselves.",
                    "2023 — Lumina becomes a marketplace. Twenty-six founding sellers join after the platform re-launches with self-service store tools.",
                    "2025 — Our 50,000th order ships from our improved Negombo fulfilment floor.",
                    "2026 — Mobile-first redesign and Cash-on-Delivery v1 roll out island-wide.",
                ],
            },
            {
                type: "cta",
                title: "Shop with us",
                text: "Browse curated products from sellers we know by name.",
                button: {label: "Visit the Store", to: "/shop"},
            },
        ],
    },

    careers: {
        title: "Careers",
        intro:
            "We are a small, senior team in Negombo building the friendliest marketplace in Sri Lanka. If you like ownership, clear communication and shipping things that work — you will fit right in.",
        blocks: [
            {
                type: "paragraphs",
                text: [
                    "We hire for judgement over résumés, and we treat hybrid work as the default: come to the studio when it helps, work from wherever you focus best the rest of the time.",
                ],
            },
            {
                type: "bullets",
                title: "Why Lumina",
                items: [
                    {
                        label: "Real scope",
                        text: "Small team — your work ships, and you see its impact in the numbers the same week."
                    },
                    {
                        label: "Flexible hybrid",
                        text: "Studio in Negombo, remote-friendly roles, core collaboration hours 10:00–15:00."
                    },
                    {
                        label: "Learning budget",
                        text: "Annual allowance for courses, conferences and the gear that keeps you sharp."
                    },
                    {label: "Marketplace discount", text: "Staff credit on Lumina orders — the obvious perk."},
                ],
            },
            {
                type: "roles",
                title: "Open positions",
                items: [
                    {
                        title: "Full-Stack Engineer (React / Node)",
                        dept: "Engineering",
                        type: "Full-time",
                        location: "Negombo · Hybrid",
                        blurb:
                            "Own features end-to-end across our React storefront and the Express + MongoDB backend currently in build. 3+ years with modern JavaScript; care for tests and clean APIs.",
                    },
                    {
                        title: "Product Designer (UI/UX)",
                        dept: "Design",
                        type: "Full-time",
                        location: "Colombo / Remote",
                        blurb:
                            "Design flows for buyers, sellers and admins that work from mobile to desktop. You will keep our design system honest and our wireframes moving to shipped product.",
                    },
                    {
                        title: "Warehouse & Fulfilment Lead",
                        dept: "Operations",
                        type: "Full-time",
                        location: "Negombo · On-site",
                        blurb:
                            "Run the dispatch floor: carrier relationships, SLA tracking, and the returns pipeline. Logistics experience in Sri Lanka strongly preferred.",
                    },
                    {
                        title: "Customer Support Officer",
                        dept: "Customer Care",
                        type: "Full-time",
                        location: "Negombo · Hybrid",
                        blurb:
                            "First line for orders, delivery and COD questions in English, Sinhala or Tamil. You write the answers our FAQ will borrow next quarter.",
                    },
                ],
            },
            {
                type: "contact",
                title: "No role fits you?",
                items: [
                    {label: "Send a spec", value: "careers@lumina.lk", href: "mailto:careers@lumina.lk"},
                    {
                        label: "Note",
                        value: "Tell us what you would fix or build first — that pitch beats a cover letter every time."
                    },
                ],
            },
        ],
    },

    press: {
        title: "Press",
        intro:
            "Newsroom resources, announcements and how to reach our communications team.",
        blocks: [
            {
                type: "paragraphs",
                title: "Latest releases",
                text: [
                    "Aug 2026 — Lumina launches self-service seller portal with live inventory and analytics tools. \"Sellers should run their store, not email us spreadsheets,\" says founder Ruwan Jayawardena.",
                    "May 2026 — Summer Sale reaches 40% off across 120 island-wide sellers; free delivery threshold kept at Rs. 5,000 year-round.",
                    "Feb 2026 — Marketplace passes 50,000 delivered orders with an average fulfilment time under three days.",
                ],
            },
            {
                type: "bullets",
                title: "Media resources",
                items: [
                    {
                        label: "Brand assets",
                        text: "Logo, colour palette and product photography guidelines are available on request — usually within one business day."
                    },
                    {
                        label: "Founding story",
                        text: "Interviews with the founding team can be arranged for print, radio and podcast."
                    },
                    {label: "Fact sheet", text: "Company history, leadership, and current operating numbers."},
                ],
            },
            {
                type: "contact",
                title: "Media contact",
                items: [
                    {label: "Email", value: "press@lumina.lk", href: "mailto:press@lumina.lk"},
                    {label: "Phone", value: "+94 31 200 4500 (Mon–Fri, 9:00–17:00)"},
                    {label: "Studio", value: "No. 48, Main Street, Negombo, Western Province"},
                ],
            },
        ],
    },

    blog: {
        title: "The Lumina Blog",
        intro:
            "Buying guides, maker stories and notes from the warehouse floor. Published whenever we have something worth saying.",
        blocks: [
            {
                type: "articles",
                items: [
                    {
                        title: "How to Choose ANC Headphones Without Overpaying",
                        date: "2026-09-02",
                        tag: "Buying guide",
                        body: [
                            "Active noise cancelling has gone from luxury to baseline, but the price range is wild — Rs. 14,500 to well over Rs. 60,000. The three things actually worth paying for are cancel depth on low rumble (buses, planes, fans), comfort at the two-hour mark, and a stable multipoint connection.",
                            "Ignore marketing about cancel depth in decibels; read owner reviews about the specific hum you live with. If your main use is an office with an air-conditioner, a Rs. 15,000 pair like our Pro Wireless Headphones will genuinely do 80% of the job.",
                            "One more thing: check the stock indicator before you get attached. Local sellers restock in waves, and COD means you can order two candidates and return the loser within 14 days. That beats any spec sheet.",
                        ],
                    },
                    {
                        title: "Behind the Craft: The Ceramicist Behind Our Best-Selling Lamp",
                        date: "2026-08-19",
                        tag: "Seller stories",
                        body: [
                            "Each Homestoke Ceramic Table Lamp leaves a two-person studio in Digana with a slightly different speckle in the glaze — that is the point. We asked founder Nimali Perera what it took to move from weekend craft fairs to shipping 300 orders a month.",
                            "\"The marketplace tools did less than I expected and more than I needed,\" she laughs. \"What changed everything was seeing stock run out mid-campaign. The low-stock alerts let me batch the kiln weeks ahead of demand instead of after it.\"",
                            "Her advice to makers thinking of selling online: photograph like your customer is buying a gift for someone else, and write descriptions for your mother — no jargon, real dimensions, honest materials.",
                        ],
                    },
                    {
                        title: "Why We Bet on Cash on Delivery (For Now)",
                        date: "2026-07-27",
                        tag: "Company",
                        body: [
                            "A meaningful share of first-time Sri Lankan shoppers still do not trust paying before a parcel arrives — and frankly, trust must be earned. So Lumina v1 ships one payment method and does it properly: the courier takes cash, your order is confirmed, the seller gets notified, and money only moves when the box is in your hands.",
                            "This is a phase, not a destination. Card and online-wallet rails are designed into our data layer (order → payment status Pending/Paid/Failed), so when they switch on, nothing about tracking, cancellations or returns changes for you.",
                            "If you are a seller: expect COD orders to average slightly higher basket sizes but a modest refusal-at-door rate. Our fulfilment notes recommend calling to confirm anything above Rs. 25,000 — we handle that from the dashboard.",
                        ],
                    },
                ],
            },
            {
                type: "callout",
                text: "Want to write for us? Sellers are always welcome to pitch a product or process story — reach us at blog@lumina.lk.",
            },
        ],
    },

    "customer-service": {
        title: "Customer Service",
        intro:
            "Answers to the questions we get most. Still stuck? Our care team replies within one business day.",
        blocks: [
            {
                type: "faq",
                title: "Frequently asked questions",
                items: [
                    {
                        q: "How do I track my order?",
                        a: "Sign in and open My Orders, then click Track on the order you want. You will see the full timeline — placed, processing, shipped, delivered — with estimated delivery dates.",
                    },
                    {
                        q: "What payment methods can I use?",
                        a: "Cash on Delivery is the only payment method in version 1: pay the courier when your parcel arrives. Card and online wallet options are coming with the payments rollout and will not change how tracking or returns work.",
                    },
                    {
                        q: "Can I cancel an order?",
                        a: "Yes — while an order is still Pending or Processing you can cancel it from My Orders with one click (we ask for a reason so the seller can restock). Once it ships, use the returns process instead.",
                    },
                    {
                        q: "How long does delivery take?",
                        a: "Most parcels arrive in 2–5 business days depending on your district; items ship within 24 hours of order confirmation once the seller accepts. Full breakdown is on the Shipping Info page.",
                    },
                    {
                        q: "Is there a fee for Cash on Delivery?",
                        a: "No. Delivery is a flat Rs. 450 and free on orders of Rs. 5,000 or more — the same price for every payment method.",
                    },
                    {
                        q: "How do I contact a seller?",
                        a: "Open the product page and use the seller card to visit their store, then use Contact Store. Sellers on Lumina maintain a published response rate, and most reply within a few hours.",
                    },
                    {
                        q: "Something arrived damaged. What now?",
                        a: "Photograph the item and packaging, then raise it through Customer Service within 48 hours of delivery. For damaged or wrong items our return window extends to 7 days beyond the standard policy and the refund is processed on pickup — see the Returns page.",
                    },
                ],
            },
            {
                type: "contact",
                title: "Other ways to reach us",
                items: [
                    {label: "Email", value: "support@lumina.lk", href: "mailto:support@lumina.lk"},
                    {label: "Phone", value: "+94 31 200 4501", href: "tel:+94312004501"},
                    {label: "Hours", value: "Mon–Sat, 9:00–18:00 (responses within one business day)"},
                    {
                        label: "Before writing in",
                        value: "Have your order number ready (it looks like #ORD-2026-00184) — it saves a round trip."
                    },
                ],
            },
        ],
    },

    returns: {
        title: "Returns & Refunds",
        intro:
            "Changed your mind? Fine. Wrong item? Also fine. Here is exactly how returns work on Lumina.",
        blocks: [
            {
                type: "paragraphs",
                title: "The short version",
                text: [
                    "You have 14 days from delivery to return most items for a refund, or 7 extra days to exchange for the same item. The product must be unused, complete and in its original packaging with tags where they exist.",
                ],
            },
            {
                type: "steps",
                title: "How to return something",
                items: [
                    {
                        label: "Start from your order",
                        text: "Sign in → My Orders → open the delivered order you want to return."
                    },
                    {
                        label: "Tell us why",
                        text: "Contact Customer Service with the order number and reason, and attach photos for damaged or wrong items."
                    },
                    {
                        label: "We arrange pickup",
                        text: "A courier collects the item from your address within 3 business days at no cost to you."
                    },
                    {
                        label: "Seller inspects",
                        text: "The seller checks the item against the return conditions — usually same day it reaches them."
                    },
                    {
                        label: "Refund is processed",
                        text: "Cash COD refunds are handed over at pickup where agreed, otherwise within 7 days of the seller accepting the return."
                    },
                ],
            },
            {
                type: "bullets",
                title: "What can be returned",
                items: [
                    {
                        label: "Almost everything",
                        text: "Any product marked as Active in a store, returned within 14 days in resalable condition."
                    },
                    {
                        label: "Damaged or wrong items",
                        text: "Always returnable — report within 48 hours of delivery with photos, and we extend the window by 7 days."
                    },
                ],
            },
            {
                type: "bullets",
                title: "What cannot be returned",
                items: [
                    {
                        label: "Personalised or made-to-order items",
                        text: "Custom engraving, sizing or colourways are final sale unless faulty."
                    },
                    {
                        label: "Hygiene & consumables",
                        text: "Opened personal-care items, in-ear tips that have been fitted, batteries and similar consumables."
                    },
                    {
                        label: "Used with visible wear",
                        text: "Electronics with activation damage, missing accessories, or packaging destroyed beyond identification."
                    },
                ],
            },
            {
                type: "callout",
                text: "Refund amounts cover the item price and any delivery fee you paid for that order. Seller discretion applies beyond these conditions — every store lists their own policy on their page.",
            },
            {
                type: "cta",
                title: "Ready to return something?",
                text: "Start from your order history or contact our care team.",
                button: {label: "Go to My Orders", to: "/account/orders"},
                secondary: {label: "Contact Support", to: "/customer-service"},
            },
        ],
    },

    "shipping-info": {
        title: "Shipping Information",
        intro:
            "Flat, boring, predictable: Rs. 450 standard delivery, free above Rs. 5,000, island-wide.",
        blocks: [
            {
                type: "table",
                title: "Delivery times by zone",
                head: ["Zone", "Districts", "Business days"],
                rows: [
                    ["Zone 1 — Western", "Colombo, Gampaha, Kalutara", "1–2"],
                    ["Zone 2 — Southern & Central", "Galle, Matara, Kandy, Kegalle, Ratnapura", "2–3"],
                    ["Zone 3 — North Central & Uva", "Anuradhapura, Polonnaruwa, Badulla, Monaragala", "3–5"],
                    ["Zone 4 — Northern & Eastern", "Jaffna, Kilinochchi, Mullaitivu, Vavuniya, Mannar, Trincomalee, Batticaloa, Ampara", "3–5"],
                ],
            },
            {
                type: "bullets",
                title: "How it works",
                items: [
                    {
                        label: "Seller accepts within 24 hours",
                        text: "Your order goes to the seller immediately. Most accept the same working day — check their response rate on the product page."
                    },
                    {
                        label: "Track every step",
                        text: "As soon as a parcel label is created, your order timeline updates and you can follow it from My Orders → Track."
                    },
                    {
                        label: "Pay at the door",
                        text: "Cash on Delivery is standard — have the exact amount ready where possible. The courier will wait while you check the parcel contents."
                    },
                    {
                        label: "Missed the courier?",
                        text: "One free re-delivery attempt follows automatically. After that, contact support to reschedule within 7 days before the parcel returns to the seller."
                    },
                ],
            },
            {
                type: "paragraphs",
                title: "Fees & thresholds",
                text: [
                    "Standard delivery is a flat Rs. 450 per order regardless of zone. Orders totalling Rs. 5,000 or more after discounts ship free — the cart and checkout always show this before you pay.",
                    "Express and same-day options for Colombo and Gampaha are planned for the next logistics phase; this page will be the first place it appears.",
                ],
            },
            {
                type: "callout",
                text: "Public holidays and weather disruptions can add a day to any zone. If your order is time-critical, message the seller before ordering — they will tell you honestly.",
            },
        ],
    },

    "privacy-policy": {
        title: "Privacy Policy",
        intro:
            "Plain-language version first: we collect what an order needs, we share it only with your seller and the courier, and we never sell your data.",
        updated: "Last updated: 1 September 2026",
        blocks: [
            {
                type: "paragraphs",
                title: "1 · What we collect",
                text: [
                    "Account information you give us: name, email, phone number, and password (stored protected — never in plain text once the backend is live).",
                    "Order information: items purchased, delivery address, billing notes, COD payment status, and order history.",
                    "Technical information: device and browser basics needed to keep the site working, and the cart/session data your browser stores locally.",
                ],
            },
            {
                type: "paragraphs",
                title: "2 · How we use it",
                text: [
                    "To process orders: confirming stock, coordinating the seller, generating the delivery label, and completing cash-on-delivery reconciliation.",
                    "To support you: answering service requests, handling returns and cancellations, and notifying you of order status changes.",
                    "To improve the marketplace: aggregated, de-identified statistics about what sells and where delivery is slow. No individual profiling, ever.",
                ],
            },
            {
                type: "bullets",
                title: "3 · Who we share it with",
                items: [
                    {
                        label: "Your seller",
                        text: "Name, phone, address and order line-items for fulfilment only. Sellers may not contact you for marketing without your consent."
                    },
                    {
                        label: "Delivery partners",
                        text: "The minimum needed to hand your parcel over: recipient, address, phone and cash to collect."
                    },
                    {
                        label: "Nobody else",
                        text: "We do not sell or rent personal data, and we do not pass it to advertisers."
                    },
                ],
            },
            {
                type: "paragraphs",
                title: "4 · Cookies & local storage",
                text: [
                    "Lumina uses your browser's local storage to remember your session (so you stay signed in) and your cart. Clearing site data removes all of it.",
                    "We do not use cross-site tracking cookies.",
                ],
            },
            {
                type: "paragraphs",
                title: "5 · Security",
                text: [
                    "During this frontend preview, demo data lives only in your browser. When the production backend ships, transport is encrypted (HTTPS), passwords are salted and hashed, and role checks happen server-side on every privileged action.",
                ],
            },
            {
                type: "paragraphs",
                title: "6 · Your rights",
                text: [
                    "You can access and correct your profile and addresses at any time from My Account → Profile. You can request deletion of your account and the erasure of personal data we hold beyond what law or open-order fulfilment requires.",
                    "Write to privacy@lumina.lk and we will action your request within 30 days.",
                ],
            },
            {
                type: "contact",
                title: "7 · Questions about privacy",
                items: [
                    {label: "Data officer", value: "privacy@lumina.lk", href: "mailto:privacy@lumina.lk"},
                    {
                        label: "Post",
                        value: "Lumina (Pvt) Ltd, No. 48, Main Street, Negombo, Western Province, Sri Lanka"
                    },
                ],
            },
        ],
    },
};

/** Slugs that the footer links to, kept in sync with AppRoutes. */
export const INFO_SLUGS = Object.keys(INFO_PAGES);
