import { PrismaClient, TenantType, BookingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, setHours, setMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing data
  await prisma.booking.deleteMany()
  await prisma.blockedSlot.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.service.deleteMany()
  await prisma.tenantUser.deleteMany()
  await prisma.tenantSettings.deleteMany()
  await prisma.tenant.deleteMany()
  await prisma.superAdmin.deleteMany()

  // Super admin
  const superAdminPassword = await bcrypt.hash('SuperAdmin2024!', 10)
  await prisma.superAdmin.create({
    data: {
      email: 'superadmin@platform.com',
      password: superAdminPassword,
      name: 'Platform Admin',
    },
  })
  console.log('✅ Super admin created')

  // ─── BRIGHT WINDOWS ───────────────────────────────────────────────
  const brightWindowsAdminPw = await bcrypt.hash('BrightWindows2024!', 10)
  const brightWindows = await prisma.tenant.create({
    data: {
      slug: 'bright-windows',
      businessName: 'Bright Windows',
      type: TenantType.WINDOW_CLEANER,
      settings: {
        create: {
          primaryColor: '#0EA5E9',
          secondaryColor: '#0369A1',
          accentColor: '#38BDF8',
          tagline: 'Crystal Clear Results, Every Time',
          description:
            'Bright Windows is a professional window cleaning service covering Birmingham and the surrounding areas. Fully insured, streak-free guaranteed, and always on time.',
          phone: '0121 456 7890',
          email: 'hello@bright-windows.co.uk',
          address: '14 Station Road',
          city: 'Birmingham',
          heroImageUrl:
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80',
            'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80',
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
          ],
          openingHours: {
            mon: { open: '08:00', close: '18:00', enabled: true },
            tue: { open: '08:00', close: '18:00', enabled: true },
            wed: { open: '08:00', close: '18:00', enabled: true },
            thu: { open: '08:00', close: '18:00', enabled: true },
            fri: { open: '08:00', close: '17:00', enabled: true },
            sat: { open: '09:00', close: '14:00', enabled: true },
            sun: { open: '00:00', close: '00:00', enabled: false },
          },
        },
      },
      users: {
        create: {
          email: 'admin@bright-windows.co.uk',
          password: brightWindowsAdminPw,
          name: 'Dave Clarke',
        },
      },
    },
  })

  const bwServices = await prisma.$transaction([
    prisma.service.create({ data: { tenantId: brightWindows.id, name: 'Residential Window Clean', description: 'Full exterior clean of all windows. Streak-free guaranteed.', duration: 90, price: 45 } }),
    prisma.service.create({ data: { tenantId: brightWindows.id, name: 'Commercial Window Clean', description: 'Professional clean for office and retail premises.', duration: 180, price: 120 } }),
    prisma.service.create({ data: { tenantId: brightWindows.id, name: 'Conservatory Clean', description: 'Full conservatory roof and glass clean.', duration: 120, price: 65 } }),
    prisma.service.create({ data: { tenantId: brightWindows.id, name: 'Gutter Clear & Clean', description: 'Full gutter clearance and flush through.', duration: 120, price: 80 } }),
  ])

  const bwCustomers = await prisma.$transaction([
    prisma.customer.create({ data: { tenantId: brightWindows.id, name: 'Sarah Mitchell', email: 'sarah.mitchell@email.co.uk', phone: '07700 900123' } }),
    prisma.customer.create({ data: { tenantId: brightWindows.id, name: 'James Cooper', email: 'j.cooper@email.co.uk', phone: '07700 900456' } }),
    prisma.customer.create({ data: { tenantId: brightWindows.id, name: 'Helen Ford', email: 'helen.ford@email.co.uk', phone: '07700 900789' } }),
    prisma.customer.create({ data: { tenantId: brightWindows.id, name: 'Robert Hughes', email: 'r.hughes@email.co.uk', phone: '07700 900321' } }),
    prisma.customer.create({ data: { tenantId: brightWindows.id, name: 'Patricia Evans', email: 'p.evans@email.co.uk', phone: '07700 900654' } }),
  ])

  const today = new Date()
  await prisma.$transaction([
    prisma.booking.create({ data: { tenantId: brightWindows.id, customerId: bwCustomers[0].id, serviceId: bwServices[0].id, startTime: setMinutes(setHours(addDays(today, 1), 9), 0), endTime: setMinutes(setHours(addDays(today, 1), 10), 30), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: brightWindows.id, customerId: bwCustomers[1].id, serviceId: bwServices[2].id, startTime: setMinutes(setHours(addDays(today, 1), 11), 0), endTime: setMinutes(setHours(addDays(today, 1), 13), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: brightWindows.id, customerId: bwCustomers[2].id, serviceId: bwServices[0].id, startTime: setMinutes(setHours(addDays(today, 2), 10), 0), endTime: setMinutes(setHours(addDays(today, 2), 11), 30), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: brightWindows.id, customerId: bwCustomers[3].id, serviceId: bwServices[3].id, startTime: setMinutes(setHours(addDays(today, 3), 9), 0), endTime: setMinutes(setHours(addDays(today, 3), 11), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: brightWindows.id, customerId: bwCustomers[4].id, serviceId: bwServices[1].id, startTime: setMinutes(setHours(addDays(today, 4), 13), 0), endTime: setMinutes(setHours(addDays(today, 4), 16), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: brightWindows.id, customerId: bwCustomers[0].id, serviceId: bwServices[0].id, startTime: setMinutes(setHours(addDays(today, -3), 9), 0), endTime: setMinutes(setHours(addDays(today, -3), 10), 30), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: brightWindows.id, customerId: bwCustomers[1].id, serviceId: bwServices[0].id, startTime: setMinutes(setHours(addDays(today, -5), 11), 0), endTime: setMinutes(setHours(addDays(today, -5), 12), 30), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: brightWindows.id, customerId: bwCustomers[2].id, serviceId: bwServices[2].id, startTime: setMinutes(setHours(addDays(today, -7), 14), 0), endTime: setMinutes(setHours(addDays(today, -7), 16), 0), status: BookingStatus.COMPLETED } }),
  ])

  console.log('✅ Bright Windows created')

  // ─── SHEAR PERFECTION ─────────────────────────────────────────────
  const shearAdminPw = await bcrypt.hash('ShearPerfection2024!', 10)
  const shearPerfection = await prisma.tenant.create({
    data: {
      slug: 'shear-perfection',
      businessName: 'Shear Perfection',
      type: TenantType.HAIRDRESSER,
      settings: {
        create: {
          primaryColor: '#BE185D',
          secondaryColor: '#831843',
          accentColor: '#F9A8D4',
          tagline: 'Where Style Meets Precision',
          description:
            'Shear Perfection is an award-winning hair salon in the heart of Manchester. Our expert stylists bring the latest techniques and trends to every appointment.',
          phone: '0161 234 5678',
          email: 'hello@shear-perfection.co.uk',
          address: '22 King Street',
          city: 'Manchester',
          heroImageUrl:
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
            'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
            'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80',
            'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
            'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=800&q=80',
            'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80',
          ],
          openingHours: {
            mon: { open: '00:00', close: '00:00', enabled: false },
            tue: { open: '09:00', close: '18:00', enabled: true },
            wed: { open: '09:00', close: '18:00', enabled: true },
            thu: { open: '09:00', close: '20:00', enabled: true },
            fri: { open: '09:00', close: '20:00', enabled: true },
            sat: { open: '08:30', close: '17:00', enabled: true },
            sun: { open: '10:00', close: '15:00', enabled: true },
          },
        },
      },
      users: {
        create: {
          email: 'admin@shear-perfection.co.uk',
          password: shearAdminPw,
          name: 'Emma Walsh',
        },
      },
    },
  })

  const spServices = await prisma.$transaction([
    prisma.service.create({ data: { tenantId: shearPerfection.id, name: 'Cut & Blowdry', description: 'Precision cut and professional blowdry finish.', duration: 60, price: 45 } }),
    prisma.service.create({ data: { tenantId: shearPerfection.id, name: 'Colour', description: 'Full head colour with toner and blowdry.', duration: 150, price: 95 } }),
    prisma.service.create({ data: { tenantId: shearPerfection.id, name: 'Highlights', description: 'Partial or full highlights with toner.', duration: 120, price: 75 } }),
    prisma.service.create({ data: { tenantId: shearPerfection.id, name: 'Balayage', description: 'Hand-painted balayage for a natural sun-kissed look.', duration: 180, price: 120 } }),
    prisma.service.create({ data: { tenantId: shearPerfection.id, name: 'Trim', description: 'Tidy up split ends and shape. No blowdry.', duration: 30, price: 25 } }),
  ])

  const spCustomers = await prisma.$transaction([
    prisma.customer.create({ data: { tenantId: shearPerfection.id, name: 'Sophie Turner', email: 'sophie.t@email.co.uk', phone: '07800 100111' } }),
    prisma.customer.create({ data: { tenantId: shearPerfection.id, name: 'Chloe Davies', email: 'chloe.d@email.co.uk', phone: '07800 100222' } }),
    prisma.customer.create({ data: { tenantId: shearPerfection.id, name: 'Rachel Green', email: 'r.green@email.co.uk', phone: '07800 100333' } }),
    prisma.customer.create({ data: { tenantId: shearPerfection.id, name: 'Laura Bennett', email: 'l.bennett@email.co.uk', phone: '07800 100444' } }),
    prisma.customer.create({ data: { tenantId: shearPerfection.id, name: 'Jessica Mills', email: 'j.mills@email.co.uk', phone: '07800 100555' } }),
  ])

  await prisma.$transaction([
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[0].id, serviceId: spServices[3].id, startTime: setMinutes(setHours(addDays(today, 1), 10), 0), endTime: setMinutes(setHours(addDays(today, 1), 13), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[1].id, serviceId: spServices[0].id, startTime: setMinutes(setHours(addDays(today, 1), 14), 0), endTime: setMinutes(setHours(addDays(today, 1), 15), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[2].id, serviceId: spServices[2].id, startTime: setMinutes(setHours(addDays(today, 2), 11), 0), endTime: setMinutes(setHours(addDays(today, 2), 13), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[3].id, serviceId: spServices[1].id, startTime: setMinutes(setHours(addDays(today, 3), 9), 0), endTime: setMinutes(setHours(addDays(today, 3), 11), 30), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[4].id, serviceId: spServices[0].id, startTime: setMinutes(setHours(addDays(today, 4), 16), 0), endTime: setMinutes(setHours(addDays(today, 4), 17), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[0].id, serviceId: spServices[0].id, startTime: setMinutes(setHours(addDays(today, -2), 10), 0), endTime: setMinutes(setHours(addDays(today, -2), 11), 0), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[1].id, serviceId: spServices[3].id, startTime: setMinutes(setHours(addDays(today, -4), 13), 0), endTime: setMinutes(setHours(addDays(today, -4), 16), 0), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[2].id, serviceId: spServices[1].id, startTime: setMinutes(setHours(addDays(today, -6), 11), 0), endTime: setMinutes(setHours(addDays(today, -6), 13), 30), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[3].id, serviceId: spServices[4].id, startTime: setMinutes(setHours(addDays(today, -8), 14), 0), endTime: setMinutes(setHours(addDays(today, -8), 14), 30), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: shearPerfection.id, customerId: spCustomers[4].id, serviceId: spServices[2].id, startTime: setMinutes(setHours(addDays(today, -10), 9), 0), endTime: setMinutes(setHours(addDays(today, -10), 11), 0), status: BookingStatus.COMPLETED } }),
  ])

  console.log('✅ Shear Perfection created')

  // ─── PEAK PERFORMANCE PT ─────────────────────────────────────────
  const peakAdminPw = await bcrypt.hash('PeakPerformance2024!', 10)
  const peakPerformance = await prisma.tenant.create({
    data: {
      slug: 'peak-performance',
      businessName: 'Peak Performance PT',
      type: TenantType.PERSONAL_TRAINER,
      settings: {
        create: {
          primaryColor: '#DC2626',
          secondaryColor: '#7F1D1D',
          accentColor: '#F97316',
          tagline: 'Push Past Your Limits',
          description:
            'Peak Performance PT is a results-driven personal training service based in Leeds. Whether you want to lose weight, build muscle, or train for an event — we get results.',
          phone: '0113 345 6789',
          email: 'coach@peak-performance.co.uk',
          address: '8 Park Lane',
          city: 'Leeds',
          heroImageUrl:
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
            'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
            'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
          ],
          openingHours: {
            mon: { open: '06:00', close: '21:00', enabled: true },
            tue: { open: '06:00', close: '21:00', enabled: true },
            wed: { open: '06:00', close: '21:00', enabled: true },
            thu: { open: '06:00', close: '21:00', enabled: true },
            fri: { open: '06:00', close: '20:00', enabled: true },
            sat: { open: '07:00', close: '14:00', enabled: true },
            sun: { open: '00:00', close: '00:00', enabled: false },
          },
        },
      },
      users: {
        create: {
          email: 'admin@peak-performance.co.uk',
          password: peakAdminPw,
          name: 'Marcus Reid',
        },
      },
    },
  })

  const ppServices = await prisma.$transaction([
    prisma.service.create({ data: { tenantId: peakPerformance.id, name: '1-to-1 PT Session', description: 'Focused one-to-one personal training session tailored to your goals.', duration: 60, price: 60 } }),
    prisma.service.create({ data: { tenantId: peakPerformance.id, name: 'Block of 5 Sessions', description: 'Five 1-to-1 sessions booked in advance. Save £30.', duration: 60, price: 270 } }),
    prisma.service.create({ data: { tenantId: peakPerformance.id, name: 'Online Coaching Call', description: 'Remote coaching and programming review via video call.', duration: 45, price: 40 } }),
    prisma.service.create({ data: { tenantId: peakPerformance.id, name: 'Fitness Assessment', description: 'Full baseline assessment: measurements, strength tests, movement screens.', duration: 60, price: 35 } }),
  ])

  const ppCustomers = await prisma.$transaction([
    prisma.customer.create({ data: { tenantId: peakPerformance.id, name: 'Tom Bradley', email: 'tom.b@email.co.uk', phone: '07900 200111' } }),
    prisma.customer.create({ data: { tenantId: peakPerformance.id, name: 'Amy Clarke', email: 'amy.c@email.co.uk', phone: '07900 200222' } }),
    prisma.customer.create({ data: { tenantId: peakPerformance.id, name: 'Dan Morrison', email: 'dan.m@email.co.uk', phone: '07900 200333' } }),
    prisma.customer.create({ data: { tenantId: peakPerformance.id, name: 'Zoe Phillips', email: 'z.phillips@email.co.uk', phone: '07900 200444' } }),
    prisma.customer.create({ data: { tenantId: peakPerformance.id, name: 'Chris Watts', email: 'c.watts@email.co.uk', phone: '07900 200555' } }),
  ])

  await prisma.$transaction([
    prisma.booking.create({ data: { tenantId: peakPerformance.id, customerId: ppCustomers[0].id, serviceId: ppServices[0].id, startTime: setMinutes(setHours(addDays(today, 1), 7), 0), endTime: setMinutes(setHours(addDays(today, 1), 8), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: peakPerformance.id, customerId: ppCustomers[1].id, serviceId: ppServices[3].id, startTime: setMinutes(setHours(addDays(today, 1), 9), 0), endTime: setMinutes(setHours(addDays(today, 1), 10), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: peakPerformance.id, customerId: ppCustomers[2].id, serviceId: ppServices[0].id, startTime: setMinutes(setHours(addDays(today, 2), 6), 30), endTime: setMinutes(setHours(addDays(today, 2), 7), 30), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: peakPerformance.id, customerId: ppCustomers[3].id, serviceId: ppServices[2].id, startTime: setMinutes(setHours(addDays(today, 3), 18), 0), endTime: setMinutes(setHours(addDays(today, 3), 18), 45), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: peakPerformance.id, customerId: ppCustomers[4].id, serviceId: ppServices[0].id, startTime: setMinutes(setHours(addDays(today, 4), 12), 0), endTime: setMinutes(setHours(addDays(today, 4), 13), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: peakPerformance.id, customerId: ppCustomers[0].id, serviceId: ppServices[0].id, startTime: setMinutes(setHours(addDays(today, -2), 7), 0), endTime: setMinutes(setHours(addDays(today, -2), 8), 0), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: peakPerformance.id, customerId: ppCustomers[1].id, serviceId: ppServices[0].id, startTime: setMinutes(setHours(addDays(today, -4), 9), 0), endTime: setMinutes(setHours(addDays(today, -4), 10), 0), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: peakPerformance.id, customerId: ppCustomers[2].id, serviceId: ppServices[1].id, startTime: setMinutes(setHours(addDays(today, -6), 6), 30), endTime: setMinutes(setHours(addDays(today, -6), 7), 30), status: BookingStatus.COMPLETED } }),
  ])

  console.log('✅ Peak Performance PT created')

  // ─── RAPIDFIX PLUMBING ────────────────────────────────────────────
  const rapidAdminPw = await bcrypt.hash('RapidFix2024!', 10)
  const rapidFix = await prisma.tenant.create({
    data: {
      slug: 'rapidfix-plumbing',
      businessName: 'RapidFix Plumbing',
      type: TenantType.PLUMBER,
      settings: {
        create: {
          primaryColor: '#1D4ED8',
          secondaryColor: '#1E3A8A',
          accentColor: '#F97316',
          tagline: 'Fast, Reliable, Fixed Right First Time',
          description:
            'RapidFix Plumbing provides fast, professional plumbing services across Bristol and the surrounding area. Available 24/7 for emergencies. Gas Safe registered.',
          phone: '0117 678 9012',
          email: 'hello@rapidfix-plumbing.co.uk',
          address: '5 Redcliffe Way',
          city: 'Bristol',
          heroImageUrl:
            'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1558618047-f4e4b1e1c3b7?w=800&q=80',
            'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
          ],
          openingHours: {
            mon: { open: '07:00', close: '19:00', enabled: true },
            tue: { open: '07:00', close: '19:00', enabled: true },
            wed: { open: '07:00', close: '19:00', enabled: true },
            thu: { open: '07:00', close: '19:00', enabled: true },
            fri: { open: '07:00', close: '19:00', enabled: true },
            sat: { open: '08:00', close: '17:00', enabled: true },
            sun: { open: '09:00', close: '14:00', enabled: true },
          },
        },
      },
      users: {
        create: {
          email: 'admin@rapidfix-plumbing.co.uk',
          password: rapidAdminPw,
          name: 'Steve Harris',
        },
      },
    },
  })

  const rfServices = await prisma.$transaction([
    prisma.service.create({ data: { tenantId: rapidFix.id, name: 'Standard Callout', description: 'Diagnosis and repair for standard plumbing issues.', duration: 60, price: 85 } }),
    prisma.service.create({ data: { tenantId: rapidFix.id, name: 'Emergency Callout', description: 'Priority response within 2 hours. Available 24/7.', duration: 60, price: 150 } }),
    prisma.service.create({ data: { tenantId: rapidFix.id, name: 'Boiler Service', description: 'Annual boiler service and safety check. Certificate included.', duration: 90, price: 95 } }),
    prisma.service.create({ data: { tenantId: rapidFix.id, name: 'Drain Unblock', description: 'Full drain investigation and unblocking service.', duration: 60, price: 75 } }),
    prisma.service.create({ data: { tenantId: rapidFix.id, name: 'New Tap Fitting', description: 'Supply and fit a new tap (customer to provide tap).', duration: 60, price: 65 } }),
  ])

  const rfCustomers = await prisma.$transaction([
    prisma.customer.create({ data: { tenantId: rapidFix.id, name: 'Mark Thompson', email: 'm.thompson@email.co.uk', phone: '07600 300111' } }),
    prisma.customer.create({ data: { tenantId: rapidFix.id, name: 'Linda Baker', email: 'l.baker@email.co.uk', phone: '07600 300222' } }),
    prisma.customer.create({ data: { tenantId: rapidFix.id, name: 'Peter Jones', email: 'p.jones@email.co.uk', phone: '07600 300333' } }),
    prisma.customer.create({ data: { tenantId: rapidFix.id, name: 'Karen White', email: 'k.white@email.co.uk', phone: '07600 300444' } }),
    prisma.customer.create({ data: { tenantId: rapidFix.id, name: 'Neil Watson', email: 'n.watson@email.co.uk', phone: '07600 300555' } }),
  ])

  await prisma.$transaction([
    prisma.booking.create({ data: { tenantId: rapidFix.id, customerId: rfCustomers[0].id, serviceId: rfServices[2].id, startTime: setMinutes(setHours(addDays(today, 1), 9), 0), endTime: setMinutes(setHours(addDays(today, 1), 10), 30), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: rapidFix.id, customerId: rfCustomers[1].id, serviceId: rfServices[0].id, startTime: setMinutes(setHours(addDays(today, 1), 14), 0), endTime: setMinutes(setHours(addDays(today, 1), 15), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: rapidFix.id, customerId: rfCustomers[2].id, serviceId: rfServices[3].id, startTime: setMinutes(setHours(addDays(today, 2), 10), 0), endTime: setMinutes(setHours(addDays(today, 2), 11), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: rapidFix.id, customerId: rfCustomers[3].id, serviceId: rfServices[4].id, startTime: setMinutes(setHours(addDays(today, 3), 11), 0), endTime: setMinutes(setHours(addDays(today, 3), 12), 0), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: rapidFix.id, customerId: rfCustomers[4].id, serviceId: rfServices[2].id, startTime: setMinutes(setHours(addDays(today, 4), 13), 0), endTime: setMinutes(setHours(addDays(today, 4), 14), 30), status: BookingStatus.CONFIRMED } }),
    prisma.booking.create({ data: { tenantId: rapidFix.id, customerId: rfCustomers[0].id, serviceId: rfServices[0].id, startTime: setMinutes(setHours(addDays(today, -1), 11), 0), endTime: setMinutes(setHours(addDays(today, -1), 12), 0), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: rapidFix.id, customerId: rfCustomers[1].id, serviceId: rfServices[1].id, startTime: setMinutes(setHours(addDays(today, -3), 8), 0), endTime: setMinutes(setHours(addDays(today, -3), 9), 0), status: BookingStatus.COMPLETED } }),
    prisma.booking.create({ data: { tenantId: rapidFix.id, customerId: rfCustomers[2].id, serviceId: rfServices[2].id, startTime: setMinutes(setHours(addDays(today, -5), 14), 0), endTime: setMinutes(setHours(addDays(today, -5), 15), 30), status: BookingStatus.COMPLETED } }),
  ])

  console.log('✅ RapidFix Plumbing created')
  console.log('\n🎉 Seed complete!\n')
  console.log('Super admin:      superadmin@platform.com  /  SuperAdmin2024!')
  console.log('Bright Windows:   admin@bright-windows.co.uk  /  BrightWindows2024!')
  console.log('Shear Perfection: admin@shear-perfection.co.uk  /  ShearPerfection2024!')
  console.log('Peak Performance: admin@peak-performance.co.uk  /  PeakPerformance2024!')
  console.log('RapidFix:         admin@rapidfix-plumbing.co.uk  /  RapidFix2024!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
