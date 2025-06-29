import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  export function PopupAlert({
    open,
    onClose,
    title,
    message,
    variant = "default", // or "destructive"
  }: {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    variant?: "default" | "destructive";
  }) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={variant} onClick={onClose}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  