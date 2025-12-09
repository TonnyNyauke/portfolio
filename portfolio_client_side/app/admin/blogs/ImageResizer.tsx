import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

const ImageResizer = ({ editor }: { editor: Editor }) => {
    const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  
    useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'IMG') {
          setSelectedImage(target as HTMLImageElement);
        } else {
          setSelectedImage(null);
        }
      };
  
      editor.view.dom.addEventListener('click', handleClick);
      return () => editor.view.dom.removeEventListener('click', handleClick);
    }, [editor]);
  
    if (!selectedImage) return null;
  
    const handleResize = (size: 'small' | 'medium' | 'large' | 'full') => {
      const sizes = {
        small: '25%',
        medium: '50%',
        large: '75%',
        full: '100%',
      };
  
      editor.chain().focus().updateAttributes('image', {
        width: sizes[size],
      }).run();
    };
  
    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-2 flex gap-2">
        <Button onClick={() => handleResize('small')} className="p-2 hover:bg-gray-100 rounded">Small</Button>
        <Button onClick={() => handleResize('medium')} className="p-2 hover:bg-gray-100 rounded">Medium</Button>
        <Button onClick={() => handleResize('large')} className="p-2 hover:bg-gray-100 rounded">Large</Button>
        <Button onClick={() => handleResize('full')} className="p-2 hover:bg-gray-100 rounded">Full</Button>
      </div>
    );
  };

  export default ImageResizer