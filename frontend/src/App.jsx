
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProcessImage from "./screens/ProcessImage";
import MyImages from "./screens/MyImages";

export default function App() {

    const [images, setImages] = useState([]);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-950 text-white">
                <Sidebar />

                <main className="min-h-screen pl-64">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProcessImage
                                    images={images}
                                    setImages={setImages}
                                />
                            }
                        />
                        <Route
                            path="/images"
                            element={<MyImages images={images} />}
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
