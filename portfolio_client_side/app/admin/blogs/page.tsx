'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { FormEvent, useRef, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import ImageResizer from '@/app/admin/blogs/ImageResizer';
import { Button } from '@/components/ui/button';
import { AlertCircle, Image as ImageIcon, Loader2, Edit3, Trash2, Star, Tag, Calendar, Clock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Placeholder } from '@tiptap/extensions';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Category = 'Business' | 'Tech' | 'Faith & Business' | 'Others';

const CATEGORIES: Category[] = ['Business', 'Tech', 'Faith & Business', 'Others'];

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  file_url: string;
  category: Category;
  tags: string[];
  featured: boolean;
  read_time: string;
  views: number;
  created_at: string;
  updated_at: string;
}

//Helper function to extract image urls from HTML content
const extractImageUrls = (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const images = doc.getElementsByTagName('img');

  return Array.from(images).map(img => img.src);
};

//Function to check if url is a base64 image
const isBase64Image = (url: string): boolean => {
  return url.startsWith('data:image');
};

//Function to convert base64 to file
const base64ToFile = async (base64String: string): Promise<File> => {
  const response = await fetch(base64String);
  const blob = await response.blob();

  return new File([blob], `image-${Date.now()}.png`, { type: blob.type });
};

//Custom image extension with resizing controls
const customImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: 'auto',
        renderHTML: (attributes) => ({
          height: attributes.height,
        }),
      },
    };
  },
});

//Function to upload images to Supabase Storage
export async function uploadImage(fileOrBase64: File | string): Promise<string> {
  let file: File;

  if (typeof fileOrBase64 === 'string' && isBase64Image(fileOrBase64)) {
    file = await base64ToFile(fileOrBase64);
  } else if (fileOrBase64 instanceof File) {
    file = fileOrBase64;
  } else {
    throw new Error('Invalid input: must be either File or base64 string');
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `blogs/${fileName}`;

  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('Blogs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('Blogs')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const ToolbarButton = ({ onClick, active, disabled, children }: ToolbarButtonProps) => (
  <Button
    type="button"
    variant={active ? "secondary" : "ghost"}
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className="h-8 px-3 hover:bg-gray-100"
  >
    {children}
  </Button>
);

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 flex flex-wrap items-center gap-1 p-2">
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
        >
          ¶
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          S
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          1. List
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
        >
          {'</>'}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event) => {
              const file = (event.target as HTMLInputElement).files?.[0];
              if (file) {
                const url = await uploadImage(file);
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }
            };
            input.click();
          }}
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

function ArticlesPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [category, setCategory] = useState<Category>('Business');
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [readTime, setReadTime] = useState('5 min read');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [readyToSubmit, setReadyToSubmit] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading,
      Bold,
      Italic,
      Strike,
      Code,
      CodeBlock,
      ListItem,
      BulletList,
      OrderedList,
      Link.configure({
        openOnClick: false,
      }),
      customImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story...',
      }),
    ],
    content: '',
    immediatelyRender: false,
  });

  // Load articles
  async function loadArticles() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const fileInput = e.target;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.type.startsWith('image/')) {
        try {
          const downloadURL = await uploadImage(file);
          if (downloadURL) {
            setFileUrl(downloadURL);
          } else {
            setError('Error uploading image: no download URL received');
          }
        } catch (error) {
          setError(`Error uploading image: ${error}`);
        }
      } else {
        setError('Please upload an image file');
      }
    }
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!readyToSubmit) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const editorContent = editor?.getHTML();

      if (!title.trim()) {
        throw new Error('Please enter a title');
      }

      if (!description.trim()) {
        throw new Error('Please enter a description');
      }

      if (!editorContent || editorContent === '<p></p>') {
        throw new Error('Please add some content to your article');
      }

      if (!fileUrl) {
        throw new Error('Please upload a featured image');
      }

      // Extract all image URLs from the editor content
      const imageUrls = extractImageUrls(editorContent);
      let processedContent = editorContent;

      // Upload any base64 images and replace their URLs in the content
      for (const url of imageUrls) {
        if (isBase64Image(url)) {
          const uploadedUrl = await uploadImage(url);
          processedContent = processedContent.replace(url, uploadedUrl);
        }
      }

      const articleData = {
        title: title.trim(),
        description: description.trim(),
        content: processedContent,
        file_url: fileUrl,
        category,
        tags,
        featured,
        read_time: readTime,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        // Update existing article
        const { error } = await supabase
          .from('blogs')
          .update(articleData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Insert new article
        const { error } = await supabase
          .from('blogs')
          .insert([articleData]);

        if (error) throw error;
      }

      // Reset form
      resetForm();
      await loadArticles();

      alert(editingId ? 'Article updated successfully!' : 'Article published successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setFileUrl('');
    setCategory('Business');
    setTags([]);
    setFeatured(false);
    setReadTime('5 min read');
    setReadyToSubmit(false);
    setEditingId(null);
    editor?.commands.clearContent();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function editArticle(article: Article) {
    setTitle(article.title);
    setDescription(article.description);
    setFileUrl(article.file_url);
    setCategory(article.category);
    setTags(article.tags || []);
    setFeatured(article.featured);
    setReadTime(article.read_time);
    setEditingId(article.id);
    editor?.commands.setContent(article.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteArticle(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article. Please check the console for details.');
    }
  }

  const getCategoryColor = (category: Category) => {
    const colors = {
      'Business': 'bg-blue-100 text-blue-700',
      'Tech': 'bg-purple-100 text-purple-700',
      'Faith & Business': 'bg-amber-100 text-amber-700',
      'Others': 'bg-slate-100 text-slate-700'
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingId ? 'Edit Article' : 'Create New Article'}
          </h1>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="mr-4"
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 text-red-700 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold border-0 border-b focus:ring-0 rounded-none px-0"
                  />
                </div>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <MenuBar editor={editor} />
                  <div className="p-4 min-h-[500px] prose max-w-none">
                    <EditorContent editor={editor} />
                    {editor && <ImageResizer editor={editor} />}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline">
                    Save Draft
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                    onClick={(e) => {
                      e.preventDefault();
                      setReadyToSubmit(true);
                      handleFormSubmit(e as any);
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editingId ? 'Updating...' : 'Publishing...'}
                      </div>
                    ) : (
                      editingId ? 'Update' : 'Publish'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                      const url = await uploadImage(file);
                      if (url) setFileUrl(url);
                    }
                  }}
                >
                  {fileUrl ? (
                    <div className="relative">
                      <img
                        src={fileUrl}
                        alt="Featured"
                        className="w-full h-48 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setFileUrl('')}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Select Image
                        </Button>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        or drag and drop
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Write a brief description of your article..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will appear in article previews and search results.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 5 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  type="text"
                  placeholder="entrepreneurship, technology, faith"
                  value={tags.join(', ')}
                  onChange={(e) => setTags(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Star className="w-5 h-5 text-amber-500" />
                <span className="text-gray-900 font-medium">Feature this article</span>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Articles List */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Published Articles ({articles.length})
            </h2>

            {loading ? (
              <div className="p-12 text-center text-gray-600">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-3">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="p-12 text-center text-gray-600">
                <p>No articles yet. Create your first one!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {articles.map(article => (
                  <div
                    key={article.id}
                    className="py-6 hover:bg-gray-50 transition-colors rounded-lg px-4"
                  >
                    <div className="flex gap-4">
                      {article.file_url && (
                        <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gray-200 overflow-hidden">
                          <img
                            src={article.file_url}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {article.title}
                              </h3>
                              {article.featured && (
                                <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
                              )}
                            </div>
                            
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {article.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className={`px-3 py-1 rounded-full font-medium ${getCategoryColor(article.category)}`}>
                                {article.category}
                              </span>
                              
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                {new Date(article.created_at).toLocaleDateString()}
                              </div>
                              
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Clock className="w-4 h-4" />
                                {article.read_time}
                              </div>
                              
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Eye className="w-4 h-4" />
                                {article.views || 0}
                              </div>
                            </div>
                            
                            {article.tags && article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {article.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                                  >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => editArticle(article)}
                              className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteArticle(article.id)}
                              className="p-2 border border-red-300 rounded-lg bg-white text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ArticlesPage;