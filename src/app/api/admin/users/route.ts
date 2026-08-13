import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/admin/users - Fetch all users (Admin only)
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access. Admin privileges required.' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        company: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Fetch Users Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// PATCH /api/admin/users - Update user role (Admin only)
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const userPayload = token ? verifyJwtToken(token) : null;

    if (!userPayload || userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access. Admin privileges required.' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and target role are required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: userPayload.userId,
        action: 'UPDATE_USER_ROLE',
        entity: 'User',
        entityId: userId,
        details: `Admin updated role of ${updatedUser.name} (${updatedUser.email}) to ${role}`,
      },
    });

    return NextResponse.json({
      message: `User role updated to ${role} successfully`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Update User Role Error:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
