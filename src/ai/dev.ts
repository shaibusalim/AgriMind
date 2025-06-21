import { config } from 'dotenv';
config();

import '@/ai/flows/predict-crop-yield.ts';
import '@/ai/flows/detect-crop-pests-diseases.ts';
import '@/ai/flows/recommend-optimal-crop.ts';