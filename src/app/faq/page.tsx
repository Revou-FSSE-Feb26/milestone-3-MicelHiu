import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const faqs = [
    { q: "How do I place an order?", a: "Browse products, click 'Add to Cart', then proceed to checkout from the Cart page." },
    { q: "What payment methods are accepted?", a: "We accept bank transfers, credit/debit cards, and major e-wallets." },
    { q: "Can I return a product?", a: "Yes, returns are accepted within 7 days of delivery for unopened items in original condition." },
    { q: "How long does shipping take?", a: "Standard shipping takes 2–5 business days. Express options are available at checkout." },
    { q: "How do I become a seller?", a: "Sign in as an Admin and use the dashboard to list your products." },
];

export default function FAQPage() {
    return (
        <>
        <Navigation />
        <main className="bg-white text-black mx-auto w-full px-12 py-12 min-h-screen">
            <h1 className="text-center text-2xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-center text-gray-400 text-sm mb-8">Everything you need to know about Revoshop.</p>
            <div className="flex flex-col gap-6">
            {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-sm mb-1">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
                </div>
            ))}
            </div>
        </main>
        <Footer />
        </>
    );
}