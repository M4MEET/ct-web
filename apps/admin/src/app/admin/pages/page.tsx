import Link from 'next/link';
import { getPages } from '@/lib/data';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'inReview':
      return 'bg-yellow-100 text-yellow-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-gray-600 mt-2">Manage your website pages</p>
        </div>
        
        <Link
          href="/admin/pages/new"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Create Page
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                  Slug
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                  Language
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                  Last Modified
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{page.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    /{page.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 uppercase">
                    {page.locale}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>
                      <div>{new Date(page.updatedAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">by {page.updatedBy?.name || 'Unknown'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/pages/${page.id}/edit`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/pages/${page.id}/preview`}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      Preview
                    </Link>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No pages found</p>
          <Link
            href="/admin/pages/new"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Create your first page
          </Link>
        </div>
      )}
    </div>
  );
}