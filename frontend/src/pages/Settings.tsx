/**
 * File: src/pages/Settings.tsx
 * Module: Pages
 * Responsibility: Renders simple account and environment settings for the logged-in user
 */

import { API_BASE_URL } from '@/config/api'
import type { User } from '@/types/api'

type SettingsProps = {
  user: User | null
}

export function Settings({ user }: SettingsProps) {
  return (
    <section className="workspace">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Pengaturan</p>
          <h2>Akun</h2>
        </div>
      </header>

      <section className="settings-grid" aria-label="Detail pengaturan">
        <div className="settings-card">
          <h3>Profil</h3>
          <dl>
            <div>
              <dt>Nama</dt>
              <dd>{user?.full_name || 'Belum diatur'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
          </dl>
        </div>

        <div className="settings-card">
          <h3>API Backend</h3>
          <dl>
            <div>
              <dt>URL Dasar</dt>
              <dd>{API_BASE_URL || 'Belum dikonfigurasi'}</dd>
            </div>
            <div>
              <dt>Autentikasi</dt>
              <dd>Token Bearer</dd>
            </div>
          </dl>
        </div>
      </section>
    </section>
  )
}