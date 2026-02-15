import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is LankaLust free to use?", a: "Yes, browsing ads, using chat rooms, and the dating feature are completely free. Posting basic ads is also free. Premium features like featured ad placement may have a small fee." },
  { q: "Do I need to create an account?", a: "You can browse ads without an account, but you'll need to register to post ads, use chat rooms, access dating, or interact with other users." },
  { q: "How do I post an ad?", a: "Click 'Post Ad' in the navigation bar, select your category, fill in the details including title, description, location, and contact information, then submit. Your ad will be reviewed and published shortly." },
  { q: "Is my personal information safe?", a: "We take privacy seriously. Your email and phone number are never publicly displayed unless you choose to include them in your ad. We use encryption and never sell your data to third parties." },
  { q: "How do I report a suspicious user or ad?", a: "Each ad and user profile has a 'Report' button. You can also contact us directly at safety@lankalust.lk. We investigate all reports within 24 hours." },
  { q: "Can I delete my account?", a: "Yes, you can delete your account at any time from your account settings. All your ads, messages, and profile data will be permanently removed within 72 hours." },
  { q: "What content is not allowed?", a: "We strictly prohibit content involving minors, non-consensual activities, human trafficking, illegal substances, and any content that violates Sri Lankan law. Violations result in immediate account termination." },
  { q: "How does the dating feature work?", a: "Our dating feature shows you profiles of other users. Swipe right to 'Like' or left to 'Pass'. When two users like each other, it's a match and you can start chatting privately." },
  { q: "Are the chat rooms moderated?", a: "Yes, our chat rooms are actively moderated to ensure a safe and respectful environment. Users who violate community guidelines will be warned or banned." },
  { q: "How do I contact customer support?", a: "You can reach us via the Contact Us page, email us at support@lankalust.lk, or use the live chat feature available from 9 AM to 9 PM IST." },
];

const FaqPage = () => (
  <div className="container py-12 max-w-3xl">
    <h1 className="text-3xl font-display font-bold text-gradient mb-2">Frequently Asked Questions</h1>
    <p className="text-muted-foreground mb-8">Find answers to the most common questions about LankaLust.</p>
    <Accordion type="single" collapsible className="space-y-2">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4 bg-card/40">
          <AccordionTrigger className="text-left text-sm font-medium text-foreground">{faq.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm">{faq.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default FaqPage;
