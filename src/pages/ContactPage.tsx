import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare } from "lucide-react";

const ContactPage = () => (
  <div className="container py-12 max-w-3xl">
    <h1 className="text-3xl font-display font-bold text-gradient mb-6">Contact Us</h1>
    <p className="text-muted-foreground mb-8">Have a question, concern, or feedback? We'd love to hear from you. Fill out the form below or reach us directly.</p>

    <div className="grid md:grid-cols-2 gap-8">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="How can we help?" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Describe your issue or question..." rows={5} />
        </div>
        <Button variant="hero" className="w-full">Send Message</Button>
      </form>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card/60 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground text-sm">Email</p>
              <p className="text-muted-foreground text-sm">support@lankalust.lk</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground text-sm">Live Chat</p>
              <p className="text-muted-foreground text-sm">Available 9 AM – 9 PM IST</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-6">
          <p className="text-sm text-muted-foreground">We typically respond within 24 hours. For urgent matters related to safety, please email <span className="text-primary">safety@lankalust.lk</span> directly.</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
