/**
 * CE.SDK Automatic Design Generation - Public API
 *
 * This module provides the public API for the automatic design generation
 * functionality, including editor initialization and asset generation.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration plugins from design and video configs
import { DesignEditorConfig } from './design/plugin';
import { VideoEditorConfig } from './video/plugin';

// ============================================================================
// Types
// ============================================================================

/**
 * Result from saving a scene
 */
export interface SaveResult {
  /** Serialized scene string */
  sceneString: string;
  /** Blob URL of the exported asset */
  blobUrl: string;
}

/**
 * Context passed to editor initializers
 * Contains callbacks and asset info needed for custom actions
 */
export interface EditorInitContext {
  /** Callback when user saves the scene */
  onSave: (result: SaveResult) => void;
  /** Target export dimensions */
  exportWidth: number;
  /** Target export dimensions */
  exportHeight: number;
}

/**
 * Editor initializer function type
 * Used to configure CE.SDK instances with editor-specific settings
 *
 * @param cesdk - The CE.SDK instance to configure
 * @param context - Optional context with callbacks and asset info
 */
export type EditorInitializer = (
  cesdk: CreativeEditorSDK,
  context?: EditorInitContext
) => Promise<void>;

// ============================================================================
// Re-exports
// ============================================================================

// Re-export generation function and types
export {
  generateAsset,
  type GeneratedAsset,
  type GenerateAssetOptions,
  type OutputType
} from './generation';

// Re-export editor config plugins
export { DesignEditorConfig } from './design/plugin';
export { VideoEditorConfig } from './video/plugin';

// ============================================================================
// Editor Initialization
// ============================================================================

/**
 * Initialize the CE.SDK Design Editor for the edit modal.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Custom actions (export, save, upload)
 * - Actions dropdown in navigation bar
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param context - Optional context with callbacks for custom actions
 */
export async function initDesignEditor(
  cesdk: CreativeEditorSDK,
  context?: EditorInitContext
) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  // This sets up the UI, features, settings, and i18n for design editing
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Color palettes for design
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images)
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets (templates, images)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.blank.*',
        'ly.img.templates.presentation.*',
        'ly.img.templates.print.*',
        'ly.img.templates.social.*',
        'ly.img.image.*'
      ]
    })
  );

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Page format presets (A4, Letter, social media sizes)
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // ============================================================================
  // Custom Actions
  // ============================================================================

  // Register export action for downloading designed files
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    const { blobs, options } = await cesdk.utils.export(exportOptions);
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });

  // Register upload action for local file uploads
  cesdk.actions.register('uploadFile', (file, onProgress, actionContext) => {
    return cesdk.utils.localUpload(file, actionContext);
  });

  // Register save action when context is provided
  if (context) {
    cesdk.actions.register('saveScene', async () => {
      const engine = cesdk.engine;
      const sceneString = await engine.scene.saveToString();

      const blob = await engine.block.export(engine.scene.get() as number, {
        mimeType: 'image/png',
        targetWidth: context.exportWidth,
        targetHeight: context.exportHeight
      });

      const blobUrl = URL.createObjectURL(blob);

      context.onSave({
        sceneString,
        blobUrl
      });
    });
  }

  // ============================================================================
  // Navigation Bar Actions
  // ============================================================================

  // Configure the actions dropdown in the navigation bar
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.exportArchive.navigationBar',
        'ly.img.importScene.navigationBar',
        'ly.img.importArchive.navigationBar'
      ]
    }
  );
}

/**
 * Initialize the CE.SDK Video Editor for the edit modal.
 *
 * This function configures a CE.SDK instance with:
 * - Video editor UI configuration (timeline, clips, etc.)
 * - Asset source plugins (video, audio, captions, etc.)
 * - Custom actions (export, save, upload)
 * - Actions dropdown in navigation bar
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param context - Optional context with callbacks for custom actions
 */
export async function initVideoEditor(
  cesdk: CreativeEditorSDK,
  context?: EditorInitContext
) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the video editor configuration plugin
  // This sets up the UI, features, settings, and i18n for video editing
  await cesdk.addPlugin(new VideoEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Caption presets for video captions
  await cesdk.addPlugin(new CaptionPresetsAssetSource());

  // Color palettes for design
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images, video, audio)
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );

  // Demo assets (templates, images, video, audio)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.video.*',
        'ly.img.audio.*'
      ]
    })
  );

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Page format presets (A4, Letter, social media sizes)
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // ============================================================================
  // Navigation Bar Actions
  // ============================================================================

  // Register export action for downloading designed files
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    const { blobs, options } = await cesdk.utils.export(exportOptions);
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });

  // Register upload action for local file uploads
  cesdk.actions.register('uploadFile', (file, onProgress, actionContext) => {
    return cesdk.utils.localUpload(file, actionContext);
  });

  // Register save action when context is provided
  if (context) {
    cesdk.actions.register('saveScene', async () => {
      const engine = cesdk.engine;
      const sceneString = await engine.scene.saveToString();

      const page = engine.scene.getCurrentPage() as number;
      const blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        targetWidth: context.exportWidth,
        targetHeight: context.exportHeight
      });

      const blobUrl = URL.createObjectURL(blob);

      context.onSave({
        sceneString,
        blobUrl
      });
    });
  }

  // Configure the actions dropdown in the navigation bar
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportVideo.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.exportArchive.navigationBar',
        'ly.img.importScene.navigationBar',
        'ly.img.importArchive.navigationBar'
      ]
    }
  );
}
