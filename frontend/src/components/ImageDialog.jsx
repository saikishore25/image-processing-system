
import { X, Download } from "lucide-react";

export default function ImageDialog({ image, onClose }) {
    if (!image) return null;

    const variants = [
        { name: "Thumbnail", description: "150 × 150 px" },
        { name: "Small", description: "400 px width" },
        { name: "Medium", description: "800 px width" },
        { name: "Large", description: "1200 px width" },
        { name: "Compressed", description: "Optimized JPEG" },
        { name: "WebP", description: "WebP format" },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold">{image.name}</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Original and processed variations
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="mb-3 font-semibold">Original</h3>
                    <div className="flex h-56 items-center justify-center rounded-xl bg-slate-950 p-4">
                        <img
                            src={image.originalUrl}
                            alt="Original"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </div>

                <h3 className="mb-4 font-semibold">Modified Images</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {variants.map((variant) => (
                        <div
                            key={variant.name}
                            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                        >
                            <div className="flex h-40 items-center justify-center p-3">
                                <img
                                    src={image.originalUrl}
                                    alt={variant.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3">
                                <div>
                                    <p className="text-sm font-medium">{variant.name}</p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {variant.description}
                                    </p>
                                </div>
                                <button
                                    title="Download"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                                    onClick={() => {
                                        const link = document.createElement("a");
                                        link.href = image.originalUrl;
                                        link.download = `${variant.name}.jpg`;
                                        link.click();
                                    }}
                                >
                                    <Download size={17} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
