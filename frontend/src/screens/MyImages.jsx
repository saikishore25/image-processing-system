
import { useState } from "react";
import { Images, Image as ImageIcon } from "lucide-react";
import ImageDialog from "../components/ImageDialog";

export default function MyImages({ images }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="p-8">
            <div className="mb-8">
                <p className="mb-2 text-sm text-blue-400">WORKSPACE / LIBRARY</p>
                <h1 className="text-3xl font-bold">My Images</h1>
                <p className="mt-2 text-slate-400">
                    All your uploaded and processed images in one place.
                </p>
            </div>

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Image Library</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        {images.length} uploaded {images.length === 1 ? "image" : "images"}
                    </p>
                </div>
                <div className="rounded-lg bg-slate-800 p-3">
                    <Images size={20} className="text-blue-400" />
                </div>
            </div>

            {images.length === 0 ? (
                <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50">
                    <ImageIcon size={42} className="mb-4 text-slate-600" />
                    <p className="font-medium">Your library is empty</p>
                    <p className="mt-2 text-sm text-slate-500">
                        Process an image to see it here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                    {images.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedImage(image)}
                            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-left transition hover:-translate-y-1 hover:border-blue-500"
                        >
                            <div className="flex h-48 items-center justify-center bg-slate-950 p-3">
                                <img
                                    src={image.originalUrl}
                                    alt={image.name}
                                    className="max-h-full max-w-full rounded object-contain"
                                />
                            </div>
                            <div className="p-4">
                                <p className="truncate font-medium">{image.name}</p>
                                <p className="mt-2 text-xs text-slate-500">
                                    {image.createdAt}
                                </p>
                                <p className="mt-3 text-xs text-blue-400">
                                    View 6 variations →
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <ImageDialog
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </div>
    );
}
