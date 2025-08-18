<?php

namespace App\Jobs\Product;

use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Http\File;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class UploadProductImage implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $product_id;
    protected $image_path;
    protected $old_public_id;
    public function __construct($product_id, $image_path, $old_public_id = null)
    {
        $this->product_id = $product_id;
        $this->image_path = $image_path;
        $this->old_public_id = $old_public_id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $product = Product::findOrFail($this->product_id);

        $cloudinaryPath = Storage::disk('cloudinary')->putFile('ecom_products', new File(storage_path('app/private/' . $this->image_path)));

        $product->image_url = Storage::disk('cloudinary')->url($cloudinaryPath);
        $product->image_public_id = $cloudinaryPath;
        $product->save();

        if ($this->old_public_id) {
            Storage::disk('cloudinary')->delete($this->old_public_id);
        }

        Storage::disk('local')->delete($this->image_path);
    }
}
