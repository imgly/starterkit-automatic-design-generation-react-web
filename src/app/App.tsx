/**
 * Automatic Design Generation - Main App Component
 *
 * This application allows users to generate social media assets from podcast
 * information using the CE.SDK Engine for headless asset generation.
 */

import type { Configuration } from '@cesdk/cesdk-js';

import type { OutputType } from '../imgly';
import type { Podcast } from './api/transformer';

import { useAssetGeneration } from './hooks/useAssetGeneration';
import { useCustomization } from './hooks/useCustomization';
import { useEditorModal } from './hooks/useEditorModal';
import { useEngine } from './hooks/useEngine';
import { useGenerationWorkflow } from './hooks/useGenerationWorkflow';
import { usePodcastSearch } from './hooks/usePodcastSearch';

import { CustomizationPanel } from './CustomizationPanel/CustomizationPanel';
import { EditorModal } from './EditorModal/EditorModal';
import { GeneratedAssets } from './GeneratedAssets/GeneratedAssets';
import { PodcastSearch } from './PodcastSearch/PodcastSearch';
import { Preview } from './Preview/Preview';

import styles from './App.module.css';

interface AppProps {
  config: Configuration;
}

export default function App({ config }: AppProps) {
  // Engine lifecycle
  const { engine, isReady, videoSupported } = useEngine(config);

  // Podcast search
  const {
    searchQuery,
    searchResults,
    isSearching,
    currentPodcast,
    handleSearchChange,
    handlePodcastSelect
  } = usePodcastSearch();

  // Customization state
  const {
    message,
    backgroundColor,
    selectedSizeIndexes,
    outputType,
    setMessage,
    setBackgroundColor,
    toggleSize,
    setOutputType
  } = useCustomization();

  // Asset generation
  const {
    previewAsset,
    finalAssets,
    isLoading,
    generateAssets,
    generateSingleAsset,
    updateAsset,
    removeAsset
  } = useAssetGeneration();

  // Editor modal
  const { editingAsset, openEditor, closeEditor, saveAndClose } =
    useEditorModal(updateAsset);

  // Generation workflow orchestration
  const {
    onPodcastSelect,
    onMessageChange,
    onColorChange,
    onSizeToggle,
    onTypeChange,
    onDownload,
    onDownloadAll
  } = useGenerationWorkflow({
    engine,
    isReady,
    currentPodcast,
    backgroundColor,
    message,
    outputType,
    selectedSizeIndexes,
    setMessage,
    setBackgroundColor,
    setOutputType,
    toggleSize,
    handlePodcastSelect,
    generateAssets,
    generateSingleAsset,
    removeAsset,
    finalAssets
  });

  // Wrapper for podcast selection that handles the Podcast type
  const handleSelectPodcast = (podcast: Podcast) => {
    onPodcastSelect(podcast);
  };

  // Wrapper for type change that handles the OutputType
  const handleTypeChange = (type: OutputType) => {
    onTypeChange(type);
  };

  return (
    <div className={styles.app}>
      {/* Podcast Search Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Search Podcast</h4>
        <PodcastSearch
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          selectedPodcast={currentPodcast}
          onSearchChange={handleSearchChange}
          onPodcastSelect={handleSelectPodcast}
        />
      </div>

      {/* Customization Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Customize Design</h4>
        <div className={styles.customizationWrapper}>
          <CustomizationPanel
            message={message}
            backgroundColor={backgroundColor}
            selectedSizeIndexes={selectedSizeIndexes}
            outputType={outputType}
            videoSupported={videoSupported}
            isLoading={isLoading}
            onMessageChange={onMessageChange}
            onColorChange={onColorChange}
            onSizeToggle={onSizeToggle}
            onTypeChange={handleTypeChange}
          />
          <Preview previewAsset={previewAsset} outputType={outputType} />
        </div>
      </div>

      {/* Generated Assets Section */}
      <div className={styles.section}>
        <GeneratedAssets
          assets={finalAssets}
          onDownload={onDownload}
          onDownloadAll={onDownloadAll}
          onEdit={openEditor}
        />
      </div>

      {/* Editor Modal */}
      {editingAsset && (
        <EditorModal
          asset={editingAsset}
          config={config}
          onClose={closeEditor}
          onSave={saveAndClose}
        />
      )}
    </div>
  );
}
