import { config } from 'dotenv';
config();

import '@/ai/flows/predict-crop-yield.ts';
import '@/ai/flows/detect-crop-pests-diseases.ts';
import '@/ai/flows/recommend-optimal-crop.ts';
import '@/ai/flows/weather-forecast-flow.ts';
import '@/ai/flows/local-advisory-flow.ts';
import '@/ai/flows/send-sms-flow.ts';
