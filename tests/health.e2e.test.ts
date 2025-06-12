describe('GET /api/health (e2e)', () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  it('debería responder status ok', async () => {
    const res = await fetch(`${API_URL}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('version');
  });

  it('debería incluir la versión correcta', async () => {
    const res = await fetch(`${API_URL}/api/health`);
    const data = await res.json();
    expect(data.version).toBe(process.env.npm_package_version || '1.0.0');
  });
}); 