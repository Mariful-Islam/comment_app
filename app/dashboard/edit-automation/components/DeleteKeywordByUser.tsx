import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import React from 'react'


interface DeleteKeywordProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: any;
  refreshKeywords: () => void;
}

function DeleteKeywordByUser({isOpen, onClose, keyword, refreshKeywords }: DeleteKeywordProps) {

    const [loading, setLoading] = React.useState(false);


    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/keywords/${keyword.getValue(`_id`)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (res.ok) {
                // Handle success (e.g., show a success message, close the dialog, etc.)
                onClose();
                refreshKeywords();
                setLoading(false);
            } else {
                // Handle error (e.g., show an error message)
                setLoading(false);
            }
        } catch (error) {
            console.error('Error deleting keyword:', error);
            setLoading(false);
        }
    };  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogContent>
            <h1 className="text-2xl font-bold mb-4">Delete Keyword</h1>
            <div className="mb-6">Are you sure you want to delete this keyword ?</div>


            <div className='flex justify-end gap-4'>
                <Button type='button' variant={`outline`} onClick={onClose}>Cancel</Button>
                <Button type='button' onClick={handleDelete} >{loading ? <Spinner/> :'Delete'}</Button>

            </div>
            
        </DialogContent>
    </Dialog>
  )
}

export default DeleteKeywordByUser