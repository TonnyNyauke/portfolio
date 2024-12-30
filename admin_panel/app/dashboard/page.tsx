'use client'

import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, remove, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Trash2, Plus, Save, Image, X, Edit2, Eye, Copy, LogOut } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from 'zod';
import { useAuth } from '../context/auth-context';
import LoginPage from '../page';
import { ProjectDetails } from '../interfaces';
import { db } from '../firebase';
import { toast } from '@/hooks/use-toast';

// ... (previous interfaces and Firebase setup) ...

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  image: z.string().min(1, "Image is required"),
  githubUrl: z.string().url("Invalid GitHub URL"),
  liveUrl: z.string().url("Invalid live URL"),
  category: z.string().min(1, "Category is required"),
  technologies: z.array(z.object({ name: z.string() })).min(1, "At least one technology is required"),
});

export default function AdminPanel() {
  const { user, loading, signOut } = useAuth();
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectDetails | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  const validateProject = (project: ProjectDetails) => {
    try {
      projectSchema.parse(project);
      return { valid: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error.errors };
      }
      return { valid: false, errors: [{ message: 'Unknown validation error' }] };
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!editingProject) return;
    
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload
    const imageRef = storageRef(storage, `projects/${editingProject.id}/${file.name}`);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);
    
    setEditingProject({
      ...editingProject,
      image: imageUrl
    });
  };

  const handleDuplicateProject = async (project: ProjectDetails) => {
    const duplicatedProject = {
      ...project,
      id: '',
      title: `${project.title} (Copy)`,
      featured: false
    };
    
    const newProjectRef = push(ref(db, 'projects'));
    await set(newProjectRef, {
      ...duplicatedProject,
      id: newProjectRef.key
    });
    
    toast({
      title: 'Project duplicated',
      description: 'The project has been successfully duplicated.'
    });
  };

  const handleBatchDelete = async () => {
    if (selectedProjects.size === 0) return;
    
    const confirmDelete = window.confirm(`Delete ${selectedProjects.size} selected projects?`);
    if (!confirmDelete) return;
    
    for (const projectId of selectedProjects) {
      await remove(ref(db, `projects/${projectId}`));
    }
    
    setSelectedProjects(new Set());
    toast({
      title: 'Batch delete successful',
      description: `${selectedProjects.size} projects have been deleted.`
    });
  };

  const handleSave = async () => {
    if (!editingProject) return;

    const validation = validateProject(editingProject);
    if (!validation.valid) {
      toast({
        title: 'Validation Error',
        description: validation.errors?.[0]?.message || 'Please check all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (isNewProject) {
        const newProjectRef = push(ref(db, 'projects'));
        await set(newProjectRef, {
          ...editingProject,
          id: newProjectRef.key
        });
      } else {
        await set(ref(db, `projects/${editingProject.id}`), editingProject);
      }

      setIsDialogOpen(false);
      setEditingProject(null);
      setIsNewProject(false);
      setImagePreview(null);
      
      toast({
        title: 'Success',
        description: `Project ${isNewProject ? 'created' : 'updated'} successfully.`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save project. Please try again.',
        variant: 'destructive'
      });
    }
  };

    function handleDelete(id: string): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Signed in as {user.email}
            </p>
          </div>
          <div className="flex gap-4">
            {selectedProjects.size > 0 && (
              <Button variant="destructive" onClick={handleBatchDelete}>
                Delete Selected ({selectedProjects.size})
              </Button>
            )}
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* ... (previous Dialog and form content) ... */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingProject(defaultProject);
                  setIsNewProject(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isNewProject ? 'Create New Project' : 'Edit Project'}
                </DialogTitle>
              </DialogHeader>
              {editingProject && (
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          title: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={editingProject.category}
                        onValueChange={(value) => setEditingProject({
                          ...editingProject,
                          category: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Short Description</Label>
                    <Textarea
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        description: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <Label>Long Description</Label>
                    <Textarea
                      value={editingProject.longDescription}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        longDescription: e.target.value
                      })}
                      className="h-32"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>GitHub URL</Label>
                      <Input
                        value={editingProject.githubUrl}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          githubUrl: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Live URL</Label>
                      <Input
                        value={editingProject.liveUrl}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          liveUrl: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Technologies</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        placeholder="Add technology..."
                      />
                      <Button onClick={handleAddTechnology}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editingProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tech.name}
                          <X
                            className="w-4 h-4 ml-2 cursor-pointer"
                            onClick={() => handleRemoveTechnology(index)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingProject.featured}
                      onCheckedChange={(checked) => setEditingProject({
                        ...editingProject,
                        featured: checked
                      })}
                    />
                    <Label>Featured Project</Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Project
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="line-clamp-1">{project.title}</span>
                  {project.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Featured
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{project.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProject(project);
                      setIsNewProject(false);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Add image preview to Dialog */}
        {imagePreview && (
          <div className="mt-4">
            <Label>Image Preview</Label>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Modified project cards with selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className={
              selectedProjects.has(project.id) 
                ? 'ring-2 ring-blue-500' 
                : ''
            }>
              <div className="absolute top-2 right-2">
                <Switch
                  checked={selectedProjects.has(project.id)}
                  onCheckedChange={(checked) => {
                    const newSelected = new Set(selectedProjects);
                    if (checked) {
                      newSelected.add(project.id);
                    } else {
                      newSelected.delete(project.id);
                    }
                    setSelectedProjects(newSelected);
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="line-clamp-1">{project.title}</span>
                  {project.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Featured
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{project.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProject(project);
                      setIsNewProject(false);
                      setIsDialogOpen(true);
                      setImagePreview(project.image);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateProject(project)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}