"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

interface ConfirmationDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export default function ConfirmationDialog({ isOpen, onOpenChange }: ConfirmationDialogProps) {
    const [pdfGenerated, setPdfGenerated] = useState(false)

    const handleNoChanges = () => {
        // Generate PDF with DOT number as filename
        setPdfGenerated(true)
    }

    const handleYesChanges = () => {
        // Close the dialog and return to form for changes
        onOpenChange(false)
    }

    const handleStartOver = () => {
        setPdfGenerated(false)
        onOpenChange(false)
    }

    const generatePDF = (data: { dotNumber: string }) => {
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                {!pdfGenerated ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-blue-900 font-bold text-xl">Confirmation</DialogTitle>
                            <DialogDescription className="text-sm">Are there any changes you would like to make to the form?</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 mt-5">
                            <Button variant="outline" onClick={handleYesChanges}>
                                Yes, make changes
                            </Button>
                            <Button className="bg-blue-900 hover:bg-blue-800" onClick={handleNoChanges}>Generate the PDF</Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Form Completed</DialogTitle>
                            <DialogDescription>Your PDF has been generated and is ready to download.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="bg-muted rounded-full p-3 mb-4">
                                <Download className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-center mb-4">
                                Your PDF has been named with your DOT number
                            </p>
                            <Button variant="outline" className="w-full">
                                Download Again
                            </Button>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleStartOver} className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Start Over
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
