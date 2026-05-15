import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      id: 'super-admin',
      name: 'Super Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const admin = await prisma.superAdmin.findUnique({
          where: { email: credentials.email },
        })
        if (!admin) return null
        const valid = await bcrypt.compare(credentials.password, admin.password)
        if (!valid) return null
        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: 'SUPER_ADMIN',
          tenantId: null,
          tenantSlug: null,
        }
      },
    }),
    CredentialsProvider({
      id: 'tenant-admin',
      name: 'Tenant Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantSlug: { label: 'Tenant Slug', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.tenantSlug) return null
        const tenant = await prisma.tenant.findUnique({
          where: { slug: credentials.tenantSlug },
        })
        if (!tenant || tenant.status === 'INACTIVE') return null
        const user = await prisma.tenantUser.findFirst({
          where: { tenantId: tenant.id, email: credentials.email },
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'TENANT_ADMIN',
          tenantId: tenant.id,
          tenantSlug: tenant.slug,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.tenantId = (user as any).tenantId
        token.tenantSlug = (user as any).tenantSlug
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub
        ;(session.user as any).role = token.role
        ;(session.user as any).tenantId = token.tenantId
        ;(session.user as any).tenantSlug = token.tenantSlug
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
