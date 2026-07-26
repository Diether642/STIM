<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ClaudeAIService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl = 'https://api.anthropic.com/v1/messages';

    public function __construct()
    {
        $this->apiKey = config('services.claude.api_key', env('CLAUDE_API_KEY'));
        $this->model = config('services.claude.model', env('CLAUDE_MODEL', 'claude-sonnet-4-5'));
    }

    public function generate(string $prompt): string
    {
        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->timeout(60)->post($this->baseUrl, [
                        'model' => $this->model,
                        'max_tokens' => 4096,
                        'messages' => [
                            [
                                'role' => 'user',
                                'content' => $prompt,
                            ],
                        ],
                    ]);

            if ($response->failed()) {
                Log::error('Claude API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new \Exception('AI service unavailable. Status: ' . $response->status());
            }

            $data = $response->json();

            if (isset($data['content'][0]['text'])) {
                return $data['content'][0]['text'];
            }

            throw new \Exception('Unexpected AI response format.');
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            throw new \Exception('Could not connect to AI service. Please try again.');
        }
    }
}