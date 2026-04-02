/**
 * Generated Assets Component
 *
 * Displays the grid of generated assets with download and edit options.
 */

import type { GeneratedAsset } from '../../imgly';

import { Button } from '../Button/Button';
import { resolveAssetPath } from '../resolveAssetPath';

import { AssetCard } from './AssetCard';

import styles from './GeneratedAssets.module.css';

interface GeneratedAssetsProps {
  assets: GeneratedAsset[];
  onDownload: (asset: GeneratedAsset) => void;
  onDownloadAll: () => void;
  onEdit: (asset: GeneratedAsset) => void;
}

export function GeneratedAssets({
  assets,
  onDownload,
  onDownloadAll,
  onEdit
}: GeneratedAssetsProps) {
  const assetsLoading = assets.some((asset) => asset.isLoading);
  const sortedAssets = [...assets].sort((a, b) => a.id - b.id);

  return (
    <>
      <div className={styles.sectionHeaderWrapper}>
        <h4 className={styles.sectionTitle}>Generated Assets</h4>
        <Button
          variant="primary"
          size="small"
          disabled={assetsLoading}
          onClick={onDownloadAll}
        >
          <img
            src={resolveAssetPath('/icons/download-white.svg')}
            alt=""
            width={16}
            height={16}
          />
          <span>Download All Assets</span>
        </Button>
      </div>
      <div className={styles.assetsWrapper}>
        {sortedAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onDownload={() => onDownload(asset)}
            onEdit={() => onEdit(asset)}
          />
        ))}
      </div>
    </>
  );
}
