import React from 'react';

interface ServiceReportData {
    companyName: string;
    address: string;
    contact: string;
    serviceReportPartyName?: string;
    serviceReportPartyAddress?: string;
    serviceReportOfficeName?: string;
    serviceReportOfficeAddress?: string;
    serviceReportWorkDate?: string;
    serviceReportServices?: {
        generalPest?: boolean;
        cockroach?: boolean;
        antBlackAnt?: boolean;
        rodentControl?: boolean;
        padsMosquito?: boolean;
        crowlingInsects?: boolean;
    };
    serviceReportAreaTreated?: string;
}

interface ServiceReportPreviewProps {
    data: ServiceReportData;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}-${month}-${year}`;
}

export function ServiceReportPreview({ data }: ServiceReportPreviewProps) {
    return (
        <>
            <div
                className="service-report-preview print:bg-white print:p-0 page-break-before"
                style={{
                    width: '794px',
                    minHeight: '1080px', // Adjusted to match invoice preview logic
                    padding: '40px',
                    backgroundColor: '#fff',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '11px',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h1 style={{ margin: '0', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 'bold', color: '#6B46C1', marginBottom: '12px' }}>
                        LORVEN PEST CONTROL
                    </h1>
                    <h2 style={{ margin: '0', fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 'bold', color: '#6B46C1', textDecoration: 'underline' }}>
                        SERVICE PROGRAMME
                    </h2>
                </div>

                {/* Main Table */}
                <div style={{ border: '2px solid #000', marginBottom: '12px', overflow: 'auto' }}>
                    {/* Header Row */}
                    <div style={{ display: 'flex', backgroundColor: '#6B46C1', color: '#fff', minHeight: '40px' }}>
                        <div style={{ flex: 1, padding: '8px', borderRight: '2px solid #000', fontWeight: 'bold', fontSize: 'clamp(11px, 2.5vw, 14px)', fontStyle: 'italic', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Name of the Party
                        </div>
                        <div style={{ flex: 1, padding: '8px', fontWeight: 'bold', fontSize: 'clamp(11px, 2.5vw, 14px)', fontStyle: 'italic', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Office
                        </div>
                    </div>

                    {/* Party and Office Info */}
                    <div style={{ display: 'flex', minHeight: '140px', borderTop: '2px solid #000', flexDirection: 'row' }}>
                        <div style={{ flex: 1, padding: '10px', borderRight: '2px solid #000', fontSize: 'clamp(10px, 2.2vw, 13px)', lineHeight: '1.4', wordBreak: 'break-word' }}>
                            <p style={{ margin: '0 0 4px 0' }}>To,</p>
                            <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>
                                {data.serviceReportPartyName || 'M/S Emmennar Pharma Containers PrivateLtd'}
                            </p>
                            <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>
                                {data.serviceReportPartyAddress || 'PlotNo.31, JNPC,\nThanam(V), Parawada(M),\nAnakapalli Dist.'}
                            </p>
                        </div>
                        <div style={{ flex: 1, padding: '10px', fontSize: 'clamp(10px, 2.2vw, 13px)', lineHeight: '1.4', wordBreak: 'break-word' }}>
                            <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>
                                {data.serviceReportOfficeName || 'M/S LORVEN Pest Control'}
                            </p>
                            <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>
                                {data.serviceReportOfficeAddress || '11-7-5/a,\nWaltair Main Road,\nVisakhapatnam-\n530003'}
                            </p>
                        </div>
                    </div>

                    {/* Second Header Row */}
                    <div style={{ display: 'flex', backgroundColor: '#6B46C1', color: '#fff', borderTop: '2px solid #000', flexWrap: 'wrap' }}>
                        <div style={{ width: '100%', minWidth: '120px', flex: '0 0 25%', padding: '8px', borderRight: '2px solid #000', fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)', fontStyle: 'italic', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Work carried out on
                        </div>
                        <div style={{ flex: 1, minWidth: '150px', padding: '8px', borderRight: '2px solid #000', fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)', fontStyle: 'italic', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Name of the work / Type of service
                        </div>
                        <div style={{ width: '100%', minWidth: '120px', flex: '0 0 30%', padding: '8px', fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)', fontStyle: 'italic', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Area/ Premise treated
                        </div>
                    </div>

                    {/* Work Details */}
                    <div style={{ display: 'flex', minHeight: '140px', borderTop: '2px solid #000', flexWrap: 'wrap' }}>
                        <div style={{ width: '100%', minWidth: '120px', flex: '0 0 25%', padding: '10px', borderRight: '2px solid #000', fontSize: 'clamp(10px, 2.2vw, 13px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', wordBreak: 'break-word' }}>
                            {formatDate(data.serviceReportWorkDate || '')}
                        </div>
                        <div style={{ flex: 1, minWidth: '150px', padding: '10px', borderRight: '2px solid #000', fontSize: 'clamp(10px, 2.2vw, 13px)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ border: '1px solid #000', width: '14px', height: '14px', minWidth: '14px', display: 'inline-block', position: 'relative' }}>
                                        {data.serviceReportServices?.generalPest && (
                                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', lineHeight: '1' }}>✓</span>
                                        )}
                                    </span>
                                    <span>General Pest Control Cockroach control</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ border: '1px solid #000', width: '14px', height: '14px', minWidth: '14px', display: 'inline-block', position: 'relative' }}>
                                        {data.serviceReportServices?.antBlackAnt && (
                                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', lineHeight: '1' }}>✓</span>
                                        )}
                                    </span>
                                    <span>Ant and Black ant control</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ border: '1px solid #000', width: '14px', height: '14px', minWidth: '14px', display: 'inline-block', position: 'relative' }}>
                                        {data.serviceReportServices?.rodentControl && (
                                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', lineHeight: '1' }}>✓</span>
                                        )}
                                    </span>
                                    <span>Rodent Control bait (or)</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ border: '1px solid #000', width: '14px', height: '14px', minWidth: '14px', display: 'inline-block', position: 'relative' }}>
                                        {data.serviceReportServices?.padsMosquito && (
                                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', lineHeight: '1' }}>✓</span>
                                        )}
                                    </span>
                                    <span>Pads Mosquito Control</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ border: '1px solid #000', width: '14px', height: '14px', minWidth: '14px', display: 'inline-block', position: 'relative' }}>
                                        {data.serviceReportServices?.crowlingInsects && (
                                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', lineHeight: '1' }}>✓</span>
                                        )}
                                    </span>
                                    <span>Crowling insects</span>
                                </label>
                            </div>
                        </div>
                        <div style={{ width: '100%', minWidth: '120px', flex: '0 0 30%', padding: '10px', fontSize: 'clamp(10px, 2.2vw, 13px)', lineHeight: '1.4', wordBreak: 'break-word' }}>
                            {data.serviceReportAreaTreated || 'Emmennar Pharma Containers building out side and Inside perimeter treatment Only.'}
                        </div>
                    </div>

                    {/* Signature Row */}
                    <div style={{ display: 'flex', backgroundColor: '#6B46C1', color: '#fff', borderTop: '2px solid #000', minHeight: '40px' }}>
                        <div style={{ flex: 1, padding: '8px', borderRight: '2px solid #000', fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)', fontStyle: 'italic', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Name & Signature of the applicator
                        </div>
                        <div style={{ flex: 1, padding: '8px', fontWeight: 'bold', fontSize: 'clamp(10px, 2.2vw, 13px)', fontStyle: 'italic', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Signature of the Office-in-charge
                        </div>
                    </div>

                    {/* Signature Space */}
                    <div style={{ display: 'flex', minHeight: '80px', borderTop: '2px solid #000' }}>
                        <div style={{ flex: 1, padding: '12px', borderRight: '2px solid #000' }}></div>
                        <div style={{ flex: 1, padding: '12px' }}></div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', fontSize: 'clamp(9px, 2vw, 11px)', color: '#6B46C1', marginTop: '8px', wordBreak: 'break-word' }}>
                    {data.address}, {data.contact}, lorvenindia@yahoo.co.in
                </div>
            </div>
        </>
    );
}
