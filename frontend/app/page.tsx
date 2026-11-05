'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (data.session) router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="body-stitch">
      <div className="bokeh-bg" aria-hidden="true">
        <div className="bokeh-bubble bokeh-1"></div>
        <div className="bokeh-bubble bokeh-2"></div>
        <div className="bokeh-bubble bokeh-3"></div>
      </div>

      <main className="portal-card-single">
        <div className="form-header">
          <h1 className="form-title text-center">Login MOMS</h1>
          <p className="form-subtitle text-center">Monitoring Management System<br/>PT Bumi Jasa Utama Cabang Luwu Raya</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label text-left">Email</label>
            <div className="input-wrapper">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="pill-input text-left" placeholder="admin.hr@kalla.co.id" required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label text-left">Password</label>
            <div className="input-wrapper">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="pill-input text-left" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Login to MOMS'}
          </button>
        </form>

        <footer className="card-footer-text text-center mt-8">
          © {new Date().getFullYear()} PT Bumi Jasa Utama. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
