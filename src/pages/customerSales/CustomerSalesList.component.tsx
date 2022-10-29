import {
  useCallback,
  // useContext,
  useRef,
  useState
} from "react";
import {
  getSalesList
} from "../../api";
import { getInvoiceName, Invoice, InvoiceType, invoiceTypes } from "../../models";

import { FormikProps, useFormik } from "formik";
import * as yup from "yup";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from "primereact/datatable";
import { Row } from 'primereact/row';
import { ALERT_TYPE, showAlert } from "../../services";
import { formatAmount, formatDate } from "../../utils";
// import { UserContext } from "../../context";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";

type CustomerSalesSearch = {
  gst: string,
  invcType: InvoiceType,
  fromDate: Date;
  toDate: Date;
}

function CustomerSalesListComponent() {
  const [salesList, setSalesList] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef<any>(null);
  const [footerTemplate, setFooterTemplate] = useState<any>(undefined);
  const [listSize, setListSize] = useState<any>(0);

  // const userCtx = useContext(UserContext);

  // const invoiceMinDate = userCtx?.user?.finYearStart ? new Date(userCtx?.user?.finYearStart): undefined;
  // const invoiceMaxDate = userCtx?.user?.finYearEnd ? new Date(userCtx?.user?.finYearEnd): undefined;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const yearRange = `${currentDate.getFullYear()-2}:${currentDate.getFullYear()}`;

  const _invoiceTypes = [{label: 'All', value: 'all'}, ...invoiceTypes]

  const CustomerSalesForm: FormikProps<CustomerSalesSearch> = useFormik<CustomerSalesSearch>({
    initialValues: {
      gst: '',
      invcType: InvoiceType.Sales,
      fromDate: currentDate,
      toDate: currentDate,
    },
    validationSchema: yup.object({
      gst: yup.string().required(),
      invcType: yup.mixed().oneOf( ['all', InvoiceType.Sales, InvoiceType.Purchase, InvoiceType.CRN_SR, InvoiceType.DBN_PR] ).required('Invoice Type is required'),
      fromDate: yup.date().nullable(),
      toDate: yup.date().nullable(),
    }),
    onSubmit: async (data: CustomerSalesSearch) => {
      try {
        await getList();
      } catch (e: any) {}
    },
  });

  const getList = useCallback(async () => {

    if(!CustomerSalesForm.isValid){
      return;
    }

    setLoading(true);

    try {

      const search: any = Object.assign({}, CustomerSalesForm.values);

      search.toDate = search.toDate ? search.toDate.toISOString() : undefined;
      search.fromDate = search.fromDate ? search.fromDate.toISOString() : undefined;

      if(search.invcType == 'all'){
        delete search.invcType;
      }

      const response = await getSalesList(search);

      const records = response.data.map((x) => {
        x.invcTypeName = getInvoiceName(x.invcType);
        return x;
      });

      setSalesList(records);

      updateFooter(records);

      setLoading(false);
    } catch (e) {
      setSalesList([]);
      setFooterTemplate(undefined);
      setFooterTemplate(setListSize);

      setLoading(false);

      const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
      showAlert(alertConfig);
    }
  }, [CustomerSalesForm.values, CustomerSalesForm.isValid]);

  // useEffect( () => { tableRef?.current?.reset() }, [tableRef?.current, invoiceList])

  // const header = () => {
  //   return (
  //     <div className="flex items-center justify-between">
  //       <div>
  //       </div>
  //       <div className="text-xl">Invoices</div>
  //       <div>
  //         <Button
  //           type='button'
  //           icon="pi pi-refresh"
  //           label="Refresh List"
  //           className="p-button-raised p-button-sm !mr-2"
  //           onClick={() => {
  //             getList();
  //           }}
  //           loading={loading}
  //         ></Button>
  //         <Button
  //           type='button'
  //           icon="pi pi-download"
  //           label="Download"
  //           className="p-button-raised p-button-sm !mr-2"
  //           onClick={() => {
  //             exportCSV();
  //           }}
  //         ></Button>
  //       </div>
  //     </div>
  //   );
  // };

  const isFormFieldValid = (name: keyof CustomerSalesSearch) => !!(CustomerSalesForm.touched[name] && CustomerSalesForm.errors[name]);

  // const getFormErrorMessage = (name: keyof CustomerSalesSearch) => {
  //   return isFormFieldValid(name) && <small className="p-error">{CustomerSalesForm.errors[name]}</small>;
  // };

  const exportCSV = () => {
    tableRef?.current?.exportCSV({ selectionOnly: false });
  };

  const formatInvoiceAmount = (rowData: Invoice, field: 'invcAmt'|'taxAmt'|'gstAmt'|'amt5'|'amt12'|'amt18'|'amt28'|'amt0'|'igst'|'cgst'|'sgst') => {
    return formatAmount(rowData[field]);
  }

  const formatInvoiceDate = (rowData: Invoice) => {
    return formatDate(new Date(rowData.invcDate));
  }

  const updateFooter = function(rows: any){ 

    setTimeout( () => {
      let recordsCount = tableRef?.current?.getRows();

      if(recordsCount == listSize){
        return;
      }

      // let startIndex = tableRef?.current?.state.first;

      // let pageIndex = (tableRef?.current?.first/recordsCount) + 1;

      //Get the sum of fields of records displayed in current page.
      //const total = rows.slice(startIndex, startIndex+recordsCount).reduce( (acc: any, cur: any) => { return { amt: acc.amt+cur.invcAmt, tax: acc.tax+cur.taxAmt, gst: acc.gst+cur.gstAmt } }, {amt: 0, tax:0, gst: 0} );

      //Get the sum of fields of all records.
      const total = rows.reduce( (acc: any, cur: any) => { return { 
        amt: acc.amt+cur.invcAmt, tax: acc.tax+cur.taxAmt, gst: acc.gst+cur.gstAmt, amt5: acc.amt5+cur.amt5, amt12: acc.amt12+cur.amt12, amt18: acc.amt18+cur.amt18, amt28: acc.amt28+cur.amt28, amt0: acc.amt0+cur.amt0, igst: acc.igst+cur.igst, cgst: acc.cgst+cur.cgst, sgst: acc.sgst+cur.sgst}
      },
      {amt: 0, tax:0, gst: 0, amt5: 0, amt12: 0, amt18: 0, amt28: 0, amt0: 0, igst: 0, cgst: 0, sgst:0}
      );

      if(total.amt == 0 && total.tax == 0 && total.gst == 0 
        && total.amt5 == 0 && total.amt12 == 0 && total.amt18 == 0 
        && total.amt28 == 0 && total.amt0 == 0 && total.igst == 0 
        && total.cgst == 0 && total.sgst == 0)
      {
        setFooterTemplate(undefined);
        setListSize(0);
        return;
      }

      let html = (<ColumnGroup>
        <Row>
            <Column footer="" colSpan={9} align="right" style={{ width: '60rem' }}/>
            <Column footer={`${formatAmount(total.amt)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.tax)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.gst)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer="" colSpan={10} align="right" style={{ width: '24rem' }}/>
            <Column footer={`${formatAmount(total.amt5)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.amt12)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.amt18)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.amt28)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.amt0)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.igst)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.cgst)}`} align="right" style={{ width: '7rem' }}/>
            <Column footer={`${formatAmount(total.sgst)}`} align="right" style={{ width: '7rem' }}/>
        </Row>
        </ColumnGroup>)

      setFooterTemplate(html);
      setListSize(rows.length);
    }, 10);
  }

  return (
    <>
      <div className="p-3">
        <form className="p-fluid">
          <div className="flex gap-4">
            <div className="w-4/5">
              <fieldset className="border-2 rounded-md pb-2">
                <legend className="ml-4 text-lg">Customer Sales</legend>
                <div className="flex justify-between px-2">
                    <div className="field flex items-center gap-2 w-1/5 max-w-1/5">
                      <label htmlFor="gst" className="block"><span className='text-[#e24c4c]'>*</span>GST</label>
                      <div className="">                        
                        <InputText type="text" name="gst" id="gst" value={CustomerSalesForm.values.gst} onChange={CustomerSalesForm.handleChange} onBlur={CustomerSalesForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('gst'), 'p-inputtext-sm': true })} placeholder="GST" autoFocus required maxLength={10} />
                        {/* {getFormErrorMessage('gst')} */}
                      </div>
                    </div>
                    <div className="field flex items-center gap-2 w-1/6 max-w-1/6">
                      <label htmlFor="invcType" className="">Type</label>
                      <Dropdown inputId='invcType' id="invcType" name='invcType' options={_invoiceTypes} optionLabel="label" optionValue="value" value={CustomerSalesForm.values.invcType} onChange={(e) => { CustomerSalesForm.setFieldValue("invcType", e.value) }} onBlur={CustomerSalesForm.handleBlur} placeholder='Select Invoice Type'
                      className={classNames({ 'p-invalid': isFormFieldValid('invcType'), 'p-inputtext-sm': true })} style={{"width": "100%"}} >
                      </Dropdown>
                      {/* {getFormErrorMessage('invcType')} */}
                    </div>
                    <div className="field flex items-center gap-2">
                        <label htmlFor="fromDate" className="">From Date</label>
                        <Calendar name="fromDate" id="fromDate" value={CustomerSalesForm.values.fromDate} onChange={ (e) => { CustomerSalesForm.setFieldValue('fromDate', e.target.value) } } onBlur={CustomerSalesForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('fromDate'), 'p-inputtext-sm': true })} placeholder="From Date"
                          dateFormat="dd/mm/yy" maxDate={CustomerSalesForm.values.toDate} monthNavigator yearNavigator yearRange={yearRange} mask="99/99/9999"
                          showOnFocus={false}
                        />
                        {/* minDate={invoiceMinDate} yearRange={`${ invoiceMinDate?.getFullYear() }:${invoiceMaxDate?.getFullYear()}`} */}
                        {/* {getFormErrorMessage('fromDate')} */}
                    </div>
                    <div className="field flex items-center gap-2">
                        <label htmlFor="toDate" className="">To Date</label>
                        <Calendar name="toDate" id="toDate" value={CustomerSalesForm.values.toDate} onChange={ (e) => { CustomerSalesForm.setFieldValue('toDate', e.target.value) } } onBlur={CustomerSalesForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('toDate'), 'p-inputtext-sm': true })} placeholder="To Date"
                          dateFormat="dd/mm/yy" minDate={CustomerSalesForm.values.fromDate} monthNavigator yearNavigator yearRange={yearRange} mask="99/99/9999"
                          showOnFocus={false}
                        />
                        {/* maxDate={invoiceMaxDate} yearRange={`${ invoiceMinDate?.getFullYear() }:${invoiceMaxDate?.getFullYear()}`} */}
                        {/* {getFormErrorMessage('toDate')} */}
                    </div>
                    <div className="field flex items-center">
                      <Button type='button' label="Search" className="p-button-raised p-button-sm" onClick={CustomerSalesForm.submitForm} disabled={!CustomerSalesForm.isValid} icon="pi pi-search" />
                    </div>
                </div>
              </fieldset>
            </div>
            <div className="w-1/5 flex items-center">
              <Button
                type='button'
                icon="pi pi-refresh"
                label="Refresh List"
                className="p-button-raised p-button-sm !mr-2"
                onClick={() => {
                  getList();
                }}
                loading={loading}
              ></Button>
              <Button
                type='button'
                icon="pi pi-download"
                label="Download"
                className="p-button-raised p-button-sm !mr-2"
                onClick={() => {
                  exportCSV();
                }}
              ></Button>
            </div>
          </div>
        </form>
      </div>
      <div className="mx-3 card" style={{ maxHeight: "calc(100vh - 160px)" }}>
        <DataTable
          ref={tableRef}
          loading={loading}
          value={salesList}
          size="small"
          showGridlines
          scrollable
          // responsiveLayout="scroll"
          // autoLayout={true}
          scrollDirection="both"
          scrollHeight="65vh"
          stripedRows
          removableSort
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          rows={15}
          rowsPerPageOptions={[10, 15, 20]}
          // header={header}
          emptyMessage="No Data Available"
          filterDisplay="row"
          exportFilename="invoices"
          onValueChange={ updateFooter }
          footerColumnGroup={ footerTemplate }
        >
          <Column field="invcTypeName" header="Type" sortable style={{ width: '6rem' }}></Column>
          <Column field="invcNo" header="No" sortable
            filter filterPlaceholder="Search by no" filterHeaderClassName="p-inputtext-sm"
            showFilterMenu={false}
            style={{ width: '10rem' }}
          ></Column>
          <Column field="invcDateUI" header="Date" sortable 
            body={formatInvoiceDate}
            filter filterPlaceholder="Search by date" filterHeaderClassName="p-inputtext-sm"
            showFilterMenu={false}
            style={{ width: '8rem' }}
          ></Column>
          <Column field="mode" header="Mode" sortable style={{ width: '5rem' }}></Column>
          <Column field="cr" header="CR" sortable style={{ width: '4rem' }}></Column>
          <Column field="code" header="Code" sortable style={{ width: '5rem' }}></Column>
          <Column field="name" header="Name" sortable 
            filter filterPlaceholder="Search by name" filterHeaderClassName="p-inputtext-sm"
            showFilterMenu={false}
            style={{ width: '12rem' }}          
          ></Column>
          <Column field="town" header="Town" sortable style={{ width: '10rem' }}></Column>
          <Column
            field="invcAmt"
            header="Amt"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "invcAmt") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="taxAmt"
            header="Tax Amt"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "taxAmt") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="gstAmt"
            header="GST Amt"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "gstAmt") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column field="remarks" header="Remarks" sortable
            filter filterPlaceholder="Search by remarks" filterHeaderClassName="p-inputtext-sm"
            showFilterMenu={false}
            style={{ width: '12rem' }}
          ></Column>
          <Column field="month" header="Month" sortable
            filter filterPlaceholder="Search by Month" filterHeaderClassName="p-inputtext-sm"
            showFilterMenu={false}
            style={{ width: '8rem' }}
          ></Column>
          <Column field="st" header="ST" sortable style={{ width: '4rem' }}></Column>
          <Column
            field="amt5"
            header="Amt 5"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "amt5") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="amt12"
            header="Amt 12"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "amt12") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="amt18"
            header="Amt 18"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "amt18") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="amt28"
            header="Amt 28"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "amt28") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="amt0"
            header="Amt 0"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "amt0") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="igst"
            header="IGST"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "igst") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="cgst"
            header="CGST"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "cgst") }}
            style={{ width: '7rem' }}
          ></Column>
          <Column
            field="sgst"
            header="SGST"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatInvoiceAmount(rowData, "sgst") }}
            style={{ width: '7rem' }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default CustomerSalesListComponent;
