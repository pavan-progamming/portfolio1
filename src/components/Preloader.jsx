// src/components/Preloader.jsx

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// --- DIGITAL RAIN CANVAS COMPONENT ---
const DigitalRainCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = Math.floor(width / fontSize);

        const rainDrops = Array(columns).fill(1);
        let animationFrameId;

        const draw = () => {
            if (!ctx) return;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#39FF14';
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
            animationFrameId = window.requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
};


// --- TEXT SCRAMBLE HOOK ---
const useScramble = (text, options) => {
    const { speed = 0.04, delay = 0 } = options || {};
    const [scrambledText, setScrambledText] = useState('');
    const chars = '!<>-_\\/[]{}—=+*^?#';
    const rafRef = useRef();

    useEffect(() => {
        let frame = 0;
        const queue = text.split('').map((char) => ({
            char: ' ', finalChar: char, step: 0, complete: false,
            delay: Math.random() * (text.length / 2)
        }));
        const update = () => {
            let output = '';
            let allComplete = true;
            for (let i = 0; i < queue.length; i++) {
                const item = queue[i];
                if (frame > item.delay) {
                    if (!item.complete) {
                        item.step += speed;
                        if (item.step >= 1) {
                            item.step = 0;
                            item.char = chars[Math.floor(Math.random() * chars.length)];
                        }
                        if (frame > item.delay + 50) {
                            item.complete = true;
                        }
                        output += item.char;
                        allComplete = false;
                    } else {
                        output += item.finalChar;
                    }
                } else {
                    output += ' ';
                    allComplete = false;
                }
            }
            setScrambledText(output);
            if (!allComplete) {
                frame++;
                rafRef.current = requestAnimationFrame(update);
            }
        };
        setTimeout(() => {
            rafRef.current = requestAnimationFrame(update);
        }, delay * 1000);
        return () => cancelAnimationFrame(rafRef.current);
    }, [text, speed, delay]);
    return scrambledText;
};


const Preloader = () => {
    const displayText = useScramble("WELCOME TO MY PORTFOLIO", { speed: 0.07, delay: 0.2 });

    return (
        <motion.div
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: '#000', display: 'flex', justifyContent: 'center',
                alignItems: 'center', zIndex: 10000
            }}
            initial={{ opacity: 1 }}
            exit={{ 
                opacity: 0,
                transition: { duration: 0.8, ease: 'easeInOut', delay: 0.5 }
            }}
        >
            <DigitalRainCanvas />

            <h1 
                className="display-1 fw-bold text-glow"
                style={{
                    fontFamily: 'monospace',
                    position: 'relative',
                    zIndex: 1,
                    // --- THIS IS THE FIX ---
                    textAlign: 'center', // This will center the text lines
                    padding: '0 1rem' // Add some padding so it doesn't touch the screen edges
                }}
            >
                {displayText}
            </h1>
        </motion.div>
    );
};

export default Preloader;