import { Shield, AlertTriangle, Eye, Phone, MapPin, Users } from "lucide-react";

const tips = [
  { icon: Users, title: "Verify Identity", text: "Always verify someone's identity before meeting. Ask for recent photos, video call first, and trust your instincts if something feels off." },
  { icon: MapPin, title: "Meet in Public", text: "For first meetings, always choose a well-lit public place like a café or restaurant. Avoid secluded locations and never go to a stranger's home immediately." },
  { icon: Phone, title: "Tell Someone", text: "Always inform a trusted friend or family member about your plans — where you're going, who you're meeting, and when you expect to return." },
  { icon: Eye, title: "Protect Personal Info", text: "Never share your home address, workplace, financial details, or identification documents with someone you've just met online." },
  { icon: AlertTriangle, title: "Watch for Red Flags", text: "Be cautious of users who refuse to video call, pressure you for money, ask for personal documents, or try to move conversations off-platform quickly." },
  { icon: Shield, title: "Report Suspicious Activity", text: "If you encounter suspicious behaviour, scams, or illegal activity, report it immediately using the Report button or email safety@lankalust.lk." },
];

const SafetyPage = () => (
  <div className="container py-12 max-w-3xl">
    <h1 className="text-3xl font-display font-bold text-gradient mb-2">Safety Tips</h1>
    <p className="text-muted-foreground mb-8">Your safety is our top priority. Follow these guidelines to stay safe while using LankaLust.</p>

    <div className="grid gap-4">
      {tips.map((tip, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-border bg-card/40 p-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <tip.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{tip.title}</h3>
            <p className="text-muted-foreground text-sm">{tip.text}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <h2 className="font-semibold text-foreground mb-2">Emergency Contacts</h2>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li>Police Emergency: <span className="text-primary font-medium">119</span></li>
        <li>Women & Children Helpline: <span className="text-primary font-medium">1938</span></li>
        <li>LankaLust Safety Team: <span className="text-primary font-medium">safety@lankalust.lk</span></li>
      </ul>
    </div>
  </div>
);

export default SafetyPage;
