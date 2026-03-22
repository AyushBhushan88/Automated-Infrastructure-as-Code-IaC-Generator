import { NextResponse } from 'next/server';
import { StackConfigurationSchema, generateFiles } from 'core';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = StackConfigurationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const files = generateFiles(result.data);

    return NextResponse.json({
      success: true,
      files
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
