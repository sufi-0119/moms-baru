'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/AppShell';
import type { CulturePost } from '@/lib/demo/types';
import { useDemoData } from '@/lib/demo/DemoDataProvider';
import { nextId } from '@/lib/demo/store';
import { filterCulturePosts, sortCulturePostsByDate } from '@/lib/demo/culture';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Sparkles,
  Award,
  TrendingUp,
  Plus,
  Search,
  ArrowRight,
  X,
  Trash2,
  Edit2
} from 'lucide-react';

export default function CultureHubPage() {
  const { state, dispatch } = useDemoData();
  const { showToast } = useToast();
  const posts = state.culturePosts;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPost, setSelectedPost] = useState<CulturePost | null>(null);
  const [editingPost, setEditingPost] = useState<CulturePost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CulturePost | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Post Form State
  const emptyPost = {
    title: '',
    category: 'Culture' as CulturePost['category'],
    date: new Date().toISOString().split('T')[0],
    goal: '',
    description: '',
    pic: 'Tim HC/GA Luwu Raya',
    image_url: '',
    before: '',
    action: '',
    after: '',
    evidence: ''
  };
  const [newPost, setNewPost] = useState(emptyPost);

  const filteredPosts = sortCulturePostsByDate(
    filterCulturePosts(posts, {
      category: selectedCategory,
      status: selectedStatus,
      search: searchTerm,
    }),
  );

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.description.trim()) return;

    const improvement =
      newPost.category === 'Implementation/Improvement'
        ? {
            before: newPost.before || '-',
            action: newPost.action || '-',
            after: newPost.after || '-',
            evidence: newPost.evidence || '-'
          }
        : undefined;

    if (editingPost) {
      dispatch({
        type: 'culture/update',
        post: {
          ...editingPost,
          title: newPost.title,
          category: newPost.category,
          date: newPost.date,
          goal: newPost.goal || editingPost.goal,
          description: newPost.description,
          pic: newPost.pic,
          image_url: newPost.image_url.trim() || editingPost.image_url,
          improvement,
        },
      });
      showToast(`Postingan ${newPost.title} diperbarui.`);
      setShowAddModal(false);
      setEditingPost(null);
      setNewPost(emptyPost);
      return;
    }

    const created: CulturePost = {
      id: nextId('CUL', posts.map((item) => item.id)),
      title: newPost.title,
      category: newPost.category,
      date: newPost.date,
      goal: newPost.goal || 'Peningkatan kinerja dan budaya kerja',
      description: newPost.description,
      pic: newPost.pic,
      image_url:
        newPost.image_url.trim() ||
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
      status: 'Publikasi',
      improvement
    };

    dispatch({ type: 'culture/add', post: created });
    showToast(`Postingan ${created.title} ditambahkan.`);
    setShowAddModal(false);
    setNewPost(emptyPost);
  };

  const handleDeletePost = () => {
    if (!deleteTarget) return;
    dispatch({ type: 'culture/delete', id: deleteTarget.id });
    showToast(`Postingan ${deleteTarget.title} dihapus dari demo.`, 'info');
    setDeleteTarget(null);
  };

  return (
    <>
      <PageHeader
        title="Culture & Implementation Hub"
        subtitle="Dokumentasi aktivitas budaya kerja Kalla, inisiatif improvement operasional tambang, serta pencapaian prestasi Cabang Luwu Raya."
        notificationCount={2}
      />

      <div className="mt-6 space-y-6">
        {/* KPI & Highlights Row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Dokumentasi Budaya
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-emerald-800">
                {posts.filter((p) => p.category === 'Culture').length}
              </h3>
              <span className="text-xs text-emerald-700">Aktivitas Internal</span>
            </div>
            <p className="mt-2 text-[11px] text-emerald-600">Sosialisasi nilai & kebiasaan kerja positif</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                Inisiatif Improvement
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-blue-800">
                {posts.filter((p) => p.category === 'Implementation/Improvement').length}
              </h3>
              <span className="text-xs text-blue-700">Inovasi Lapangan</span>
            </div>
            <p className="mt-2 text-[11px] text-blue-600">Model Before - Action - After - Evidence</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Prestasi & Penghargaan
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-amber-800">
                {posts.filter((p) => p.category === 'Achievement/Recognition').length}
              </h3>
              <span className="text-xs text-amber-700">Apresiasi Klien</span>
            </div>
            <p className="mt-2 text-[11px] text-amber-600">Rekor keselamatan & sertifikasi mutu</p>
          </div>
        </section>

        {/* Toolbar & Filter Bar */}
        <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul kegiatan, inisiatif improvement, atau PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
              {[
                { id: 'ALL', label: 'Semua' },
                { id: 'Culture', label: 'Culture' },
                { id: 'Implementation/Improvement', label: 'Improvement' },
                { id: 'Achievement/Recognition', label: 'Prestasi' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    selectedCategory === tab.id
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="Publikasi">Publikasi</option>
              <option value="Draft">Draft</option>
            </select>

            <button
              onClick={() => {
                setEditingPost(null);
                setNewPost(emptyPost);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Dokumentasi</span>
            </button>
          </div>
        </section>

        {/* Galeri Card Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-md ${
                    post.category === 'Culture'
                      ? 'bg-emerald-600 text-white'
                      : post.category === 'Implementation/Improvement'
                      ? 'bg-blue-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {post.category}
                </span>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {post.date}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h4 className="line-clamp-2 text-sm font-bold text-gray-900">{post.title}</h4>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600">
                    {post.description}
                  </p>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="truncate">PIC: {post.pic}</span>
                    <div className="flex items-center gap-1">
                      <button
                        aria-label={`Edit postingan ${post.title}`}
                        onClick={() => {
                          setEditingPost(post);
                          setNewPost({
                            title: post.title,
                            category: post.category,
                            date: post.date,
                            goal: post.goal,
                            description: post.description,
                            pic: post.pic,
                            image_url: post.image_url,
                            before: post.improvement?.before ?? '',
                            action: post.improvement?.action ?? '',
                            after: post.improvement?.after ?? '',
                            evidence: post.improvement?.evidence ?? '',
                          });
                          setShowAddModal(true);
                        }}
                        className="grid h-7 w-7 place-items-center rounded bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        aria-label={`Hapus postingan ${post.title}`}
                        onClick={() => setDeleteTarget(post)}
                        className="grid h-7 w-7 place-items-center rounded bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                      >
                        Lihat Rincian <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
        {filteredPosts.length === 0 ? (
          <EmptyState
            title="Belum ada dokumentasi yang cocok"
            description="Ubah kata kunci, kategori, atau status publikasi untuk melihat dokumentasi demo."
          />
        ) : null}
      </div>

      <ConfirmDialog
        description={deleteTarget ? `Postingan ${deleteTarget.title} akan dihapus dari data demo.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeletePost}
        open={deleteTarget !== null}
        title="Hapus dokumentasi?"
      />
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    selectedPost.category === 'Culture'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedPost.category === 'Implementation/Improvement'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedPost.category}
                </span>
                <h3 className="mt-2 text-lg font-black text-gray-900">{selectedPost.title}</h3>
                <p className="text-xs text-gray-400">
                  {selectedPost.date} &bull; PIC: {selectedPost.pic}
                </p>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Image banner */}
              <div className="h-56 w-full overflow-hidden rounded-2xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="rounded-2xl bg-gray-50 p-3.5">
                <span className="block font-bold text-gray-800">Tujuan Aktivitas / Sasaran</span>
                <p className="mt-1 text-gray-600">{selectedPost.goal}</p>
              </div>

              <div>
                <span className="block font-bold text-gray-800">Deskripsi Lengkap</span>
                <p className="mt-1 leading-relaxed text-gray-600">{selectedPost.description}</p>
              </div>

              {/* Detail Khusus Improvement (Before-Action-After-Evidence) */}
              {selectedPost.improvement && (
                <div className="space-y-2 rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
                  <h5 className="font-bold text-blue-900">
                    Struktur Pelaporan Improvement (BAAE Framework)
                  </h5>
                  <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-2.5 shadow-sm">
                      <span className="block font-bold text-rose-700">1. Before (Kondisi Awal)</span>
                      <p className="mt-0.5 text-gray-600">{selectedPost.improvement.before}</p>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 shadow-sm">
                      <span className="block font-bold text-blue-700">2. Action (Tindakan)</span>
                      <p className="mt-0.5 text-gray-600">{selectedPost.improvement.action}</p>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 shadow-sm">
                      <span className="block font-bold text-emerald-700">3. After (Hasil Perbaikan)</span>
                      <p className="mt-0.5 text-gray-600">{selectedPost.improvement.after}</p>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 shadow-sm">
                      <span className="block font-bold text-purple-700">4. Evidence (Bukti/Data)</span>
                      <p className="mt-0.5 text-gray-600">{selectedPost.improvement.evidence}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH POSTINGAN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingPost ? 'Edit Dokumentasi Culture & Improvement' : 'Tambah Dokumentasi Culture & Improvement'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPost} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700">Judul Aktivitas *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Pelatihan Budaya Kerja & Safety Driver Tambang"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Kategori *</label>
                  <select
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        category: e.target.value as 'Culture' | 'Implementation/Improvement' | 'Achievement/Recognition'
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Culture">Culture</option>
                    <option value="Implementation/Improvement">Implementation/Improvement</option>
                    <option value="Achievement/Recognition">Achievement/Recognition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Tujuan / Sasaran</label>
                <input
                  type="text"
                  placeholder="Sasaran yang ingin dicapai dari aktivitas ini..."
                  value={newPost.goal}
                  onChange={(e) => setNewPost({ ...newPost, goal: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">PIC / Tim Pelaksana</label>
                <input
                  type="text"
                  value={newPost.pic}
                  onChange={(e) => setNewPost({ ...newPost, pic: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">URL Foto Dokumentasi</label>
                <input
                  type="text"
                  placeholder="https://... (atau biarkan kosong untuk foto default)"
                  value={newPost.image_url}
                  onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Deskripsi Ringkasan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Rincian jalannya kegiatan..."
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Extra fields jika Improvement */}
              {newPost.category === 'Implementation/Improvement' && (
                <div className="space-y-2 rounded-2xl border border-blue-100 bg-blue-50/40 p-3">
                  <span className="block text-xs font-bold text-blue-900">
                    Form Before-After Framework
                  </span>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Kondisi Sebelum (Before)</label>
                    <input
                      type="text"
                      placeholder="Sebelumnya..."
                      value={newPost.before}
                      onChange={(e) => setNewPost({ ...newPost, before: e.target.value })}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Tindakan Dilakukan (Action)</label>
                    <input
                      type="text"
                      placeholder="Tindakan inovasi..."
                      value={newPost.action}
                      onChange={(e) => setNewPost({ ...newPost, action: e.target.value })}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Hasil Sesudah (After)</label>
                    <input
                      type="text"
                      placeholder="Setelah perbaikan..."
                      value={newPost.after}
                      onChange={(e) => setNewPost({ ...newPost, after: e.target.value })}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Bukti / Evidensi</label>
                    <input
                      type="text"
                      placeholder="Data pendukung..."
                      value={newPost.evidence}
                      onChange={(e) => setNewPost({ ...newPost, evidence: e.target.value })}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 p-2 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  Simpan Dokumentasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
