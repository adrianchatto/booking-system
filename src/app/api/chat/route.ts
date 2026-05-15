import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TYPE_LABELS: Record<string, string> = {
  WINDOW_CLEANER: 'window cleaning',
  HAIRDRESSER: 'hair salon',
  PERSONAL_TRAINER: 'personal training',
  PLUMBER: 'plumbing',
}

export async function POST(req: NextRequest) {
  const { messages, tenantSlug } = await req.json()

  if (!tenantSlug || !messages?.length) {
    return NextResponse.json({ error: 'messages and tenantSlug required' }, { status: 400 })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug, status: 'ACTIVE' },
    include: {
      settings: true,
      services: { where: { active: true }, orderBy: { price: 'asc' } },
    },
  })

  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const servicesList = tenant.services
    .map((s) => `- ${s.name}: £${Number(s.price).toFixed(2)}, ${s.duration} mins (ID: ${s.id})`)
    .join('\n')

  const today = format(new Date(), 'EEEE dd MMMM yyyy')

  const systemPrompt = `You are a friendly, professional booking assistant for ${tenant.businessName}, a ${TYPE_LABELS[tenant.type] ?? tenant.type} business${tenant.settings?.city ? ` based in ${tenant.settings.city}` : ''}.

Your job is to help customers book appointments in a warm, conversational way. Keep responses concise and helpful.

Today is ${today}.

Available services:
${servicesList}

Contact: ${tenant.settings?.phone ?? 'available on request'} | ${tenant.settings?.email ?? ''}

When a customer wants to book:
1. Find out which service they want
2. Ask for their preferred date and time
3. Collect their name, email address, and phone number
4. Confirm all details back to them

Once you have ALL of: customer name, email, phone number, service choice, and date/time — include this exact block in your response (alongside your confirmation message):

[BOOKING_DATA]{"customerName":"FULL_NAME","customerEmail":"EMAIL","customerPhone":"PHONE","serviceId":"SERVICE_ID","preferredTime":"YYYY-MM-DDTHH:MM:SS"}[/BOOKING_DATA]

Replace the values with actual data. Use 24-hour format for time. Only include this block once you have all required information.

Keep your tone warm and professional. Use British English. If asked about pricing or availability on specific days, give helpful information based on what you know about the business.`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        })

        for await (const chunk of response) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        console.error('Chat stream error:', err)
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
