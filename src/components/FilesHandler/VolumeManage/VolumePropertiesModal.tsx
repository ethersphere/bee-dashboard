import type { ReactElement } from 'react'
import { useContext, useEffect, useState } from 'react'
import DestroyIcon from '../../icons/DestroyIcon'
import { SwarmTextInput } from '../../SwarmTextInput'
import DateSlider from './DateSlider'
import SizeSlider from './SizeSlider'
import { getHumanReadableFileSize, startDownloadingQueue } from '../../../utils/file'
import { Context as SettingsContext } from '../../../providers/Settings'
import { Context as FileManagerContext } from '../../../providers/FileManager'
import ErrorModal from './ErrorModal'
import { Duration } from '@ethersphere/bee-js'
import { ActiveVolume } from './ManageVolumesModal'
import DownloadIcon from '../../icons/DownloadIcon'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

interface VolumePropertiesModalProps {
  newVolume: boolean
  modalDisplay: (value: boolean) => void
  activeVolume: ActiveVolume
}

const VolumePropertiesModal = ({ newVolume, modalDisplay, activeVolume }: VolumePropertiesModalProps): ReactElement => {
  const classes = useFileManagerGlobalStyles()

  const [isHoveredDestroy, setIsHoveredDestroy] = useState(false)
  const [isHoveredDownload, setIsHoveredDownload] = useState(false)
  const [size, setSize] = useState(activeVolume.volume.size)
  const [validity, setValidity] = useState(new Date(activeVolume.validity))
  const [cost, setCost] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isUploadButtonEnabled, setIsUploadButtonEnabled] = useState(false)

  const { beeApi } = useContext(SettingsContext)
  const { filemanager } = useContext(FileManagerContext)

  useEffect(() => {
    const fetchCost = async () => {
      try {
        const cost = await beeApi?.getExtensionCost(activeVolume.volume.batchID, size, Duration.fromEndDate(validity))

        if (
          size.toGigabytes() <= activeVolume.volume.size.toGigabytes() &&
          validity.getTime() <= activeVolume.validity
        ) {
          setCost('0')
          setIsUploadButtonEnabled(false)
        } else {
          setCost(cost ? cost.toSignificantDigits(2) : '0')
          setIsUploadButtonEnabled(true)
        }
      } catch (e) {
        setShowErrorModal(true)
      }
    }

    fetchCost()
  }, [activeVolume, beeApi, size, validity])

  const handleMouseEnterDestroy = () => {
    setIsHoveredDestroy(true)
  }

  const handleMouseLeaveDestroy = () => {
    setIsHoveredDestroy(false)
  }

  const handleMouseEnterDownload = () => {
    setIsHoveredDownload(true)
  }

  const handleMouseLeaveDownload = () => {
    setIsHoveredDownload(false)
  }

  const updateVolume = async () => {
    if (isUploadButtonEnabled) {
      try {
        if (size > activeVolume.volume.size) {
          await beeApi?.extendStorageSize(activeVolume.volume.batchID, size)
          modalDisplay(false)
        }

        if (validity.getTime() > activeVolume.validity) {
          await beeApi?.extendStorageDuration(activeVolume.volume.batchID, Duration.fromEndDate(validity))
          modalDisplay(false)
        }
      } catch (e) {
        setShowErrorModal(true)
      }
    }
  }

  return (
    <div className={classes.propertiesContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {!newVolume ? (
          <div className={classes.infoContainer}>
            <div style={{ fontSize: '10px' }}>Volume</div>
            <div>{activeVolume?.volume.label}</div>
          </div>
        ) : (
          <div style={{}}>
            <SwarmTextInput name="name" label="Volume name (max. 6 char)" required={false} />
          </div>
        )}

        {!newVolume ? (
          <div className={classes.actionButtonContainer}>
            <div
              className={classes.actionButton}
              onMouseEnter={handleMouseEnterDestroy}
              onMouseLeave={handleMouseLeaveDestroy}
              onClick={() => {
                filemanager?.destroyVolume(activeVolume.volume.batchID)
              }}
            >
              <DestroyIcon color={isHoveredDestroy ? '#FFFFFF' : '#333333'} />
              <div style={{ textAlign: 'center' }}>Destroy volume</div>
            </div>
            <div
              className={classes.actionButton}
              onMouseEnter={handleMouseEnterDownload}
              onMouseLeave={handleMouseLeaveDownload}
              onClick={() => {
                if (filemanager) {
                  const fileInfoListsOfVolume = filemanager.fileInfoList.filter(
                    file => file.batchId.toString() === activeVolume.volume.batchID.toString(),
                  )
                  startDownloadingQueue(filemanager, fileInfoListsOfVolume)
                }
              }}
            >
              <DownloadIcon color={isHoveredDownload ? '#FFFFFF' : '#333333'} />
              <div style={{ textAlign: 'center' }}>Download now</div>
            </div>
          </div>
        ) : null}
      </div>
      <div className={classes.volumeSliders}>
        <SizeSlider
          onChange={value => setSize(value)}
          exactValue={activeVolume?.volume.size ?? 0}
          lowerLabel={`${getHumanReadableFileSize(activeVolume?.volume.size.toBytes() ?? 0).replace(
            /\s+/g,
            '',
          )}/${getHumanReadableFileSize(activeVolume?.volume.remainingSize.toBytes() ?? 0).replace(/\s+/g, '')}`}
          newVolume={false}
        />
        <DateSlider
          type="date"
          upperLabel="Extend validity to:"
          exactValue={new Date(activeVolume.validity)}
          lowerLabel="Current:"
          onDateChange={date => {
            setValidity(date)
          }}
          newVolume={false}
        />
      </div>
      <div className={classes.costContainer}>
        Cost: &nbsp; <span style={{ fontWeight: 700 }}>{cost !== null ? cost : '0'} BZZ</span>
      </div>

      <div className={classes.bottomButtonContainer}>
        <div
          className={`${classes.buttonElementBase} ${classes.generalButtonElement}`}
          style={{ width: '160px' }}
          onClick={() => modalDisplay(false)}
        >
          Cancel
        </div>
        <div
          className={`${classes.buttonElementBase} ${
            isUploadButtonEnabled ? classes.updateButtonElement : classes.disabledUpdateButtonElement
          }`}
          style={{ width: '160px' }}
          onClick={() => updateVolume()}
        >
          Update
        </div>
      </div>
      {showErrorModal ? <ErrorModal modalDisplay={value => setShowErrorModal(value)} /> : null}
    </div>
  )
}

export default VolumePropertiesModal
