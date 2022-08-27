import React, { useContext, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './FileUpload.component.css';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { downloadSampleFile, uploadFile } from '../../api';
import { getUploadConfig } from '../../utils';
import { ALERT_TYPE, showAlert } from '../../services';
import { AppContext } from '../../context';

function FileUploadComponent() {

  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(true);
  const fileUploadRef = useRef<any>(null);
  const [uploadedFileResponse, setUploadedFileResponse] = useState<{[key:string]: any}|null>(null);
  const [file, setFile] = useState<File|null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const appCtx = useContext(AppContext);

  const uploadConfig = useMemo(() => {

    return getUploadConfig(searchParams.get('type') as string);

  }, [searchParams])

  const fileUploadHandler = async () => {

    if(!file){
      return;
    }


    const params = Object.fromEntries(searchParams.entries());

    delete params.type;
    
    appCtx?.setDisplayLoader(true);

    try{
      const {data} = await uploadFile(uploadConfig.url as string, file, params);

      appCtx?.setDisplayLoader(false);

      const alertConfig = {title: 'Success', message: data.message, type: ALERT_TYPE.SUCCESS};

      if(data.status === 1 || data.status === 2){
        alertConfig.title = 'Error';
        alertConfig.type=  ALERT_TYPE.ERROR;
      }

      showAlert(alertConfig);

      if(data.status !== 0){
        setUploadedFileResponse({...data, filename: file.name});
      }

      setFile(null);
    }
    catch(e){

      appCtx?.setDisplayLoader(false);

      console.error(e);
      const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
      showAlert(alertConfig);
    }
  }

  const sampleFileDownloadHandler = async () => {

    appCtx?.setDisplayLoader(true);

    try{
      const res = await downloadSampleFile(uploadConfig.sampleFileUrl);

      const url = URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = res.headers["x-download-filename"];
      link.click();

      appCtx?.setDisplayLoader(false);
    }
    catch(e){

      appCtx?.setDisplayLoader(false);

      console.error(e);
      const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
      showAlert(alertConfig);
    }

  }

  const onFileSelect = (e:any) => {

    setUploadedFileResponse(null);
    setFile(null);

    if(e.target.files.length > 0){
      setFile(e.target.files[0]);
    }

  }

  const onHide = () => {
    setVisible(false);
    navigate(-1);
  }

  const footer = (
      <div>
          <Button label="Close" icon="pi pi-times" onClick={onHide} />
      </div>
  );

  return (
    <Dialog visible={visible} modal closeOnEscape={false} header={`${uploadConfig.title} - Upload`} footer={footer} onHide={ onHide } style={{'width': '50%'}} blockScroll={true}>
      <div className="py-2">
        <input type="file" ref={fileUploadRef} id="file" name="file" className='hidden' accept='.csv' onChange={onFileSelect} />
        <div className='flex justify-between'>
          <Button
            type='button'
            icon="pi pi-plus"
            label="Select File"
            className="p-button-raised p-button-sm"
            onClick={() => {
              fileUploadRef?.current.click()
            }}
          ></Button>
          <Button
            type='button'
            icon="pi pi-download"
            label="Download Sample"
            className="p-button-raised p-button-sm"
            onClick={() => {
              sampleFileDownloadHandler()
            }}
          ></Button>
        </div>
        <div>
        {
          file && (
            <div className='border flex justify-between items-center p-2 my-2'>
              <div><span className='pi pi-file pr-2'></span>{file.name}</div>
              <div><Tag severity="info" value={file.size/1000 + 'KB'} ></Tag></div>
              <Button
                icon=""
                label="Upload"
                className="p-button-raised p-button-sm"
                onClick={fileUploadHandler}
              ></Button>
            </div>
          )
        }
        </div>
      </div>
      <div>
        {
          uploadedFileResponse && (
            <>
              <div className='py-2 flex justify-between'>
                <div className='font-semibold'>File: {uploadedFileResponse.filename}</div>
                <div>
                  <Tag severity="info" className='mr-2 text-right' value={'Total: '+uploadedFileResponse.totalCount}></Tag>
                  <Tag severity="success" className='mr-2' value={'Success: '+uploadedFileResponse.successCount}></Tag>
                  <Tag severity="danger" className='mr-2 text-right' value={'Failed: '+uploadedFileResponse.failedCount}></Tag>
                </div>
              </div>
              <DataTable
                value={uploadedFileResponse.failedRecs}
                size="small"
                showGridlines
                scrollable
                scrollHeight="40vh"
                stripedRows
              >
                <Column field="id" header="ID"></Column>
                <Column field="errMsg" header="Error"></Column>
              </DataTable>
            </>
          )
        }
      </div>
    </Dialog>
  )
}

export default FileUploadComponent;