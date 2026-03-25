import { Metadata } from 'next';
import GalleryManager from '@/components/admin/GalleryManager';

export const metadata: Metadata = {
  title: 'Gallery Management | Admin | Moksha Sewa',
};

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage images, organize galleries, and update content
        </p>
      </div>

      <GalleryManager />
    </div>
  );
}