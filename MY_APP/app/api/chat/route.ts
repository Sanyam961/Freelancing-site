import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function lastUserMessage(messages: Array<{ role: string; content: string }>): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === 'user') return String(messages[i]?.content ?? '');
  }
  return '';
}

function localFallbackAnswer(userTextRaw: string): string {
  const userText = userTextRaw.trim();
  const q = userText.toLowerCase();

  if (!userText) return "Hi, I'm Maya. Ask me anything about SKILLIFY.";

  if (q.includes('name of') || q === 'name' || q.includes('site called') || q.includes('website called')) {
    return 'This site is called **SKILLIFY**.';
  }

  if (q.includes('features') || q.includes('what can i do') || q.includes('what do you do') || q.includes('what is this site') || q.includes('service')) {
    return [
      '**SKILLIFY** is a modern freelance marketplace.',
      '',
      '**Our Services Include:**',
      'Web Development, Full Stack Development, UI/UX Design, Video Editing, App Development, Digital Marketing, SEO, Data Science, and Animation.',
      '',
      '**Key Features:**',
      '- Hire talent (post work, review proposals, start a contract)',
      '- Find work (browse gigs, send proposals, manage your projects)',
      '- Collaborate via in-app messaging',
      '- Use secure payments (Razorpay integration)',
      '',
      'Try asking: "How do I hire a freelancer?" or "How do I get started as a freelancer?"',
    ].join('\n');
  }

  if (q.includes('hire') || q.includes('client')) {
    return [
      'To **hire talent** on SKILLIFY:',
      '- Sign up / sign in',
      '- Choose **Client** during onboarding',
      '- Create your project/job details',
      '- Review proposals and start working with the best match',
    ].join('\n');
  }

  if (q.includes('freelancer') || q.includes('find work') || q.includes('get work') || q.includes('proposal')) {
    return [
      'To **find work** on SKILLIFY:',
      '- Sign up / sign in',
      '- Choose **Freelancer** during onboarding',
      '- Complete your profile',
      '- Browse gigs and send proposals',
      '- Use the dashboard to manage conversations and contracts',
    ].join('\n');
  }

  if (q.includes('payment') || q.includes('razorpay') || q.includes('escrow')) {
    return 'Payments are handled via **Razorpay** integration (secure checkout). If you tell me what you’re trying to pay for (job/contract), I can guide you step-by-step.';
  }

  if (q.includes('dashboard')) {
    return 'Your **Dashboard** is where you manage your projects, proposals/contracts, and messages after you sign in.';
  }

  if (q.includes('reliable') || q.includes('better') || q.includes('upwork') || q.includes('fiverr') || q.includes('why use')) {
    return [
      '**Why SKILLIFY is better & reliable:**',
      '- **Project-Specific Chat:** Unlike other platforms, our messaging is strictly tied to accepted proposals, so you never mix up projects.',
      '- **Real-Time Speed:** Built on Convex, every notification, message, and proposal updates instantly.',
      '- **Zero Clutter:** A clean, modern interface focused purely on getting work done.',
      '- **Secure Payments:** Integrated with Razorpay for safe, milestone-based transactions.',
    ].join('\n');
  }

  if (q.includes('who are you') || q.includes('your work') || q.includes('what do you do')) {
    return 'I am **Maya**, the official AI assistant for SKILLIFY. My job is to guide you through the platform, help you find features, explain how to hire or get hired, and ensure you have a smooth experience here.';
  }

  if (q.includes('tour') || q.includes('extensive knowledge') || q.includes('all features')) {
    return [
      '**A Quick Tour of SKILLIFY:**',
      '1. **Role Switching:** Instantly switch between Client and Freelancer dashboards.',
      '2. **Gig Marketplace:** Clients post jobs (Web Dev, Video Editing, etc.), Freelancers browse and bid.',
      '3. **Proposals:** Freelancers send tailored cover letters and price bids.',
      '4. **Smart Messaging:** Once a proposal is accepted, a secure chat thread opens specifically for that project.',
      '5. **Payments:** Clients pay freelancers directly through the dashboard via Razorpay.',
    ].join('\n');
  }

  return [
    'I am Maya, the official AI assistant for SKILLIFY.',
    '',
    `Your question was: "${userText}"`,
    'I know everything about SKILLIFY. Ask me about our services, how we compare to others, for a tour of features, or how to get started!',
  ].join('\n');
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const messages = Array.isArray(body?.messages) ? body.messages : [];

  try {
    const aiPromise = generateText({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      model: openai('gpt-4o-mini') as any,
      system: `You are Maya, the official AI assistant for SKILLIFY. You are incredibly knowledgeable, confident, and helpful. You know every detail about this platform.

About SKILLIFY:
- It is a modern, premium freelance marketplace where Clients hire top talent and Freelancers find high-quality work.
- Services Provided: Web Development, Full Stack Development, UI/UX Design, Video Editing, App Development, Digital Marketing, SEO, Data Science, and Animation.
- Built with cutting-edge tech: Next.js (frontend), Clerk (authentication), and Convex (real-time backend).

Core Features & Flow:
1. Dual Dashboards: Users can switch seamlessly between Client and Freelancer roles.
2. Gig Posting: Clients post detailed project requirements.
3. Proposals: Freelancers submit competitive bids with cover letters.
4. Smart Messaging: Chat is strictly tied to accepted proposals. Users get dedicated chat threads per project, eliminating confusion.
5. Payments: Secure transactions integrated via Razorpay directly from the dashboard.

Why SKILLIFY is Reliable & Better than Competitors (like Upwork/Fiverr):
- Incredible Speed: Real-time updates for everything (messages, proposals, gigs) thanks to Convex. No refreshing needed.
- Project-Specific Context: Messaging is strictly organized by project, preventing the chaotic inbox problem of other platforms.
- Premium Design: A highly polished, distraction-free UI that lets professionals focus on work.
- Fair & Transparent: Clear milestones and secure Razorpay integration.

Your Persona & Job:
- "Who are you?": "I am Maya, the official AI assistant for SKILLIFY."
- "What is your work?": "I am here to guide you through every feature, help you navigate the platform, explain how things work, and ensure you have a seamless experience."
- You provide extensive tours of features when asked.
- Answer questions confidently, highlighting SKILLIFY's speed, design, and intelligent chat system.
- Prefer actionable steps and formatted lists (markdown) for readability.`,
      messages,
    });

    // Fast UX: wait up to 10 seconds for the AI to respond before falling back.
    const timeoutMs = 10000;
    const result = await Promise.race([
      aiPromise.then((r) => ({ ok: true as const, text: r.text })),
      delayMs(timeoutMs).then(() => ({ ok: false as const, text: '' })),
    ]);

    if (!result.ok) {
      const fallback = localFallbackAnswer(lastUserMessage(messages));
      return new Response(
        JSON.stringify({
          text: fallback,
          degraded: true,
          warning: 'AI is taking longer than expected. Maya is responding in fast mode.',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ text: result.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Unknown error';

    const status =
      message.toLowerCase().includes('insufficient_quota') ||
      message.toLowerCase().includes('quota')
        ? 402
        : 500;

    // Keep Maya functional even when the AI provider is unavailable.
    const fallback = localFallbackAnswer(lastUserMessage(messages));

    if (status === 402) {
      return new Response(
        JSON.stringify({
          text: fallback,
          degraded: true,
          warning:
            'OpenAI quota/billing issue. Update your OpenAI plan or use an API key with available quota to enable full AI answers.',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify({
        text: fallback,
        degraded: true,
        warning:
          'AI backend error. Maya is running in fallback mode. Configure OPENAI_API_KEY correctly to enable full AI answers.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
