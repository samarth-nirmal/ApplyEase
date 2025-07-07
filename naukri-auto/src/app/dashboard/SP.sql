If @detail_level = "I" and ( @billing_prefix_code<>'0' or @paying_prefix_code<>'0')
		BEGIN
			;WITH TAB AS (select PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,ACTIVITY_DATE,INVOICE_CURRENCY_CODE,
			               TOTAL_INVOICE_VALUE,ACCOUNTING_REFERENCE,TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,INVOICE_TYPE,BILLER_LOCAL_CURRENCY,BILLER_FOREX_RATE,FOREX_DATE,Biller_prefix_Name,
						PREFIX_CODE_NAME,BILLSITE_CODE_NAME,PAYSITE_CODE_NAME,BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
						PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME,hyperion_code,tariff_code,Special_VAT_Language,
						other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
						additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
						statistical_currency_code,statistical_currency_value,Gross_Weight,Net_Weight 		
		from (
			SELECT ROW_NUMBER() OVER
			(
	            
				ORDER BY 
				CASE WHEN @sortBy = 'reference_invoice_number' AND @OrderByDirection = 'DESC' THEN reference_invoice_number END DESC,
				CASE WHEN @sortBy = 'reference_invoice_number' AND @OrderByDirection = 'ASC' THEN  reference_invoice_number END ASC,
				CASE WHEN @sortBy = 'InvoiceDate' AND @OrderByDirection = 'DESC' THEN INVOICE_DATE END DESC,
				CASE WHEN @sortBy = 'InvoiceDate' AND @OrderByDirection = 'ASC' THEN  INVOICE_DATE END ASC,
				CASE WHEN @sortBy = 'IC' AND @OrderByDirection = 'DESC' THEN INVOICE_CURRENCY_CODE END DESC,
				CASE WHEN @sortBy = 'IC' AND @OrderByDirection = 'ASC' THEN INVOICE_CURRENCY_CODE END ASC,
				CASE WHEN @sortBy = 'LA' AND @OrderByDirection = 'DESC' THEN TOTAL_INVOICE_VALUE_LOCAL_CURRENCY END DESC,
				CASE WHEN @sortBy = 'LA' AND @OrderByDirection = 'ASC' THEN TOTAL_INVOICE_VALUE_LOCAL_CURRENCY END ASC,
				CASE WHEN @sortBy = 'IA' AND @OrderByDirection = 'DESC' THEN TOTAL_INVOICE_VALUE END DESC,
				CASE WHEN @sortBy = 'IA' AND @OrderByDirection = 'ASC' THEN TOTAL_INVOICE_VALUE END ASC
				)AS RowNumber, PDIV.division_name AS 'PAYER_DIVISION', BDIV.division_name AS 'BILLER_DIVISION', SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,
						INVOICE_DATE,ACTIVITY_DATE,INVOICE_CURRENCY_CODE, ROUND(TOTAL_INVOICE_VALUE,2) TOTAL_INVOICE_VALUE,ACCOUNTING_REFERENCE,
						ROUND(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,2) TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,INVOICE_TYPE,BILLER_LOCAL_CURRENCY,BILLER_FOREX_RATE,FOREX_DATE,@billing_prefix_code Biller_prefix_Name,
						PP.PREFIX_CODE + ' - ' +  PP.PREFIX_NAME PREFIX_CODE_NAME,BS.SITE_CODE + ' - ' + BS.SITE_NAME BILLSITE_CODE_NAME,PS.SITE_CODE + ' - ' + PS.SITE_NAME PAYSITE_CODE_NAME,
						BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PP.PREFIX_CODE AS PAYERPREFIXCODE,PP.PREFIX_NAME PAYERPREFIXNAME,BS.SITE_CODE AS BILLERSITECODE,BS.SITE_NAME AS BILLERSITENAME,
						PS.SITE_CODE PAYERSITECODE,PS.SITE_NAME AS PAYERSITENAME,PP.hyperion_code,tariff_code,Special_VAT_Language,other_remarks,approved_by,ROUND(shipping_charges,2) shipping_charges,ROUND(handling_charges,2) handling_charges,
						ROUND(insurance_charges,2) insurance_charges,ROUND(additional_cost1,2) additional_cost1,additional_cost1_description,
						ROUND(additional_cost2,2) additional_cost2,additional_cost2_description,ROUND(vat_total,2) vat_total,informational_currency_code,
						ROUND(total_invoice_value_informational_currency,2) total_invoice_value_informational_currency,statistical_currency_code,
						ROUND(statistical_currency_value,2) statistical_currency_value,gross_weight as Gross_Weight,net_weight as Net_Weight
								
				--FROM IMS_INVOICE_HEADER A WITH (NOLOCK),IMS_PREFIX PP WITH (NOLOCK),IMS_SITE BS WITH (NOLOCK),IMS_SITE PS WITH (NOLOCK),
				--IMS_PREFIX_CONSOLIDATION_STATUS PCS WITH (NOLOCK),IMS_DIVISION BDIV WITH(NOLOCK),IMS_DIVISION PDIV WITH(NOLOCK)
				From IMS_INVOICE_HEADER A WITH (NOLOCK) inner join IMS_PREFIX PP WITH (NOLOCK) on A.payer_prefix_code =PP.sys_prefix_code and A.biller_prefix_code = @billing_prefix_code
			 inner join IMS_SITE BS WITH (NOLOCK) on A.biller_site_code =BS.sys_site_code inner join IMS_SITE PS WITH (NOLOCK) on A.payer_site_code  =PS.sys_site_code inner join  
			 IMS_PREFIX_CONSOLIDATION_STATUS PCS WITH (NOLOCK) on PP.sys_prefix_code =pcs.sys_prefix_code 
			 inner join  IMS_DIVISION BDIV WITH(NOLOCK) on A.sys_division_code = BDIV.sys_division_code , IMS_DIVISION PDIV WITH(NOLOCK)  
				
				WHERE INVOICE_TYPE <> 'F'  																			
				--AND A.biller_prefix_code =CASE WHEN (ISNULL(@billing_prefix_code,'')='' OR @billing_prefix_code  ='0') 
				--						  THEN A.biller_prefix_code ELSE  @billing_prefix_code  END																					
				AND A.biller_site_code =CASE WHEN (ISNULL( @billing_site_code,'')='' OR  @billing_site_code ='0') 
										 THEN A.biller_site_code  ELSE  @billing_site_code  END	
				AND A.payer_prefix_code =CASE WHEN (ISNULL( @paying_prefix_code,'')='' OR @paying_prefix_code='0') 
										THEN A.payer_prefix_code ELSE @paying_prefix_code END
				AND A.PAYER_SITE_CODE =CASE WHEN (ISNULL(@paying_site_code ,'')='' OR @paying_site_code='0' ) 
										THEN A.PAYER_SITE_CODE ELSE  @paying_site_code END	
				--AND A.sys_payer_division_code =CASE WHEN (ISNULL( @PayerDivision,'')='' OR  @PayerDivision ='0')
				--						THEN A.sys_payer_division_code ELSE  @PayerDivision  END
				AND a.sys_division_code=CASE WHEN (ISNULL( @BillerDivision,'')='' OR  @BillerDivision ='0')
										THEN A.sys_division_code ELSE  @BillerDivision  END					
				--AND A.sys_division_code = BDIV.sys_division_code
				--AND A.sys_payer_division_code = PDIV.sys_division_code	
				--AND PAYER_PREFIX_CODE = PP.SYS_PREFIX_CODE				
				--AND BILLER_SITE_CODE = BS.SYS_SITE_CODE
				--AND PAYER_SITE_CODE = PS.SYS_SITE_CODE
				--AND PP.SYS_PREFIX_CODE = PCS.SYS_PREFIX_CODE 
				AND PCS.CONSOLIDATION_STATUS_FLAG IN ( @consol , @unconsol , @agent)
				AND PCS.STATUS_CHANGE_DATE = (SELECT MAX(STATUS_CHANGE_DATE) 
				FROM ims_prefix_consolidation_status WITH (NOLOCK)
				WHERE status_change_date <=  CONVERT(Varchar(10),@billing_to_date,101)
				AND sys_prefix_code = PCS.SYS_PREFIX_CODE GROUP BY sys_prefix_code) 
				AND INVOICE_TYPE <> 'F' 		     
				And INVOICE_TYPE =Case @invoice_type   when '0' Then INVOICE_TYPE ELSE  @invoice_type  END  
				AND BILLING_MONTH BETWEEN  Convert(Varchar(10),@billing_date,101)AND Convert(Varchar(10),@billing_to_date,101)			    
			) as a)	
					
		--select * into #tmptbl1 from (SELECT  PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,INVOICE_CURRENCY_CODE,
		--	               TOTAL_INVOICE_VALUE,ACCOUNTING_REFERENCE,TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,INVOICE_TYPE,BILLER_FOREX_RATE,FOREX_DATE,
		--				PREFIX_CODE_NAME,BILLSITE_CODE_NAME,PAYSITE_CODE_NAME,BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
		--				PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME,hyperion_code,tariff_code,Special_VAT_Language,
		--				other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
		--				additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
		--				statistical_currency_code,statistical_currency_value,'' as total_type FROM TAB) a
		select * into #tmptbl1 from (SELECT  *,'' as total_type FROM TAB) a
		--select * FROM #tmptbl1
		 select IDENTITY(INT,1,1) AS ID,* into #tmptbl11 from #tmptbl1 where 1 = 0
				
			 if @sortby <> ''
			 begin
			 exec('insert into #tmptbl11 select *  from #tmptbl1 order by ' + @sortby + ' '+ @OrderByDirection);
			 End
			 else
			 begin
			 exec('insert into #tmptbl11 select *  from #tmptbl1 ');
			 End
			 
		    select * into #tmptbl2 from (	
		    select * from #tmptbl11 							
		    --select ID,PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,INVOICE_CURRENCY_CODE,
			   --           SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,ACCOUNTING_REFERENCE,SUM(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			   --          INVOICE_TYPE,BILLER_FOREX_RATE,FOREX_DATE,PREFIX_CODE_NAME+'/'+PAYSITE_CODE_NAME,BILLSITE_CODE_NAME,PAYSITE_CODE_NAME,BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
						--PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME, hyperion_code,tariff_code,Special_VAT_Language,
						--other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
						--additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
						--statistical_currency_code,statistical_currency_value,total_type from #tmptbl11 
						--group by ID,PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,INVOICE_CURRENCY_CODE,
			   --         ACCOUNTING_REFERENCE,INVOICE_TYPE,BILLER_FOREX_RATE,FOREX_DATE,PREFIX_CODE_NAME+'/'+PAYSITE_CODE_NAME,BILLSITE_CODE_NAME,PAYSITE_CODE_NAME,BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
						--PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME, hyperion_code,tariff_code,Special_VAT_Language,
						--other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
						--additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
						--statistical_currency_code,statistical_currency_value,total_type
		    UNION ALL		 
			SELECT  MAX(ID)+1,NULL as PAYER_DIVISION, NULL as BILLER_DIVISION, NULL as SYS_INVOICE_NUMBER,NULL REFERENCE_INVOICE_NUMBER,NULL as INVOICE_DATE,NULL as ACTIVITY_DATE,NULL as INVOICE_CURRENCY_CODE,
			              SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,NULL ACCOUNTING_REFERENCE,sum(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			             NULL INVOICE_TYPE,NULL BILLER_LOCAL_CURRENCY,NULL BILLER_FOREX_RATE,NULL FOREX_DATE,NULL Biller_prefix_Name,PREFIX_CODE_NAME+'/'+PAYSITE_CODE_NAME,NULL BILLSITE_CODE_NAME,NULL PAYSITE_CODE_NAME,NULL BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,NULL PAYERPREFIXCODE,
						NULL PAYERPREFIXNAME,NULL BILLERSITECODE,NULL BILLERSITENAME,NULL PAYERSITECODE,NULL PAYERSITENAME, NULL hyperion_code,NULL tariff_code,NULL Special_VAT_Language,
						NULL other_remarks,NULL approved_by,NULL shipping_charges,NULL handling_charges,NULL insurance_charges,NULL additional_cost1,NULL additional_cost1_description,
						NULL additional_cost2,NULL additional_cost2_description,NULL vat_total,NULL informational_currency_code,NULL total_invoice_value_informational_currency,
						NULL statistical_currency_code,NULL statistical_currency_value,'' Gross_Weight,'' Net_Weight,'Sub Total(Paying Site)' as total_type FROM #tmptbl11
						group by  payer_prefix_code,PREFIX_CODE_NAME,PAYSITE_CODE_NAME,PAYER_SITE_CODE	
						) b
						order by payer_prefix_code asc,BILLER_DIVISION desc
						
		
						
			--Select ROW_NUMBER() over (order by payer_prefix_code asc,BILLER_DIVISION desc) as SNO, * from #tmptbl2;			
			
			select ROW_NUMBER() over (order by payer_prefix_code asc,PAYER_SITE_CODE asc,BILLER_DIVISION desc) as SNO,--* 
			ID,PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,ACTIVITY_DATE,INVOICE_CURRENCY_CODE,
			              SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,ACCOUNTING_REFERENCE,
			              SUM(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			             --INVOICE_TYPE,BILLER_FOREX_RATE,FOREX_DATE,PREFIX_CODE_NAME+'/'+PAYSITE_CODE_NAME AS PREFIX_CODE_NAME,BILLSITE_CODE_NAME,PAYSITE_CODE_NAME,
			             INVOICE_TYPE,BILLER_LOCAL_CURRENCY,BILLER_FOREX_RATE,FOREX_DATE,Biller_prefix_Name,PREFIX_CODE_NAME,BILLSITE_CODE_NAME,PAYSITE_CODE_NAME,
			             BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
						PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME, hyperion_code,tariff_code,Special_VAT_Language,
						other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
						additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
						statistical_currency_code,statistical_currency_value,Gross_Weight,Net_Weight,total_type			
			INTO #TMPTBL3 FROM (
			    SELECT * FROM #TMPTBL2 						
				) C GROUP BY 
				        ID,PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,ACTIVITY_DATE,INVOICE_CURRENCY_CODE,
			            ACCOUNTING_REFERENCE,INVOICE_TYPE,BILLER_LOCAL_CURRENCY,BILLER_FOREX_RATE,FOREX_DATE,Biller_prefix_Name,PREFIX_CODE_NAME,BILLSITE_CODE_NAME,
			            PAYSITE_CODE_NAME,BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
						PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME, hyperion_code,tariff_code,Special_VAT_Language,
						other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
						additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
						statistical_currency_code,statistical_currency_value,Gross_Weight,Net_Weight,total_type
						
				
			SELECT @RecordCount=COUNT(1) FROM #tmptbl3
			
			IF(@IsExport = 0)
				BEGIN
				select * into #tmptblfinalInvoice from
				(
					SELECT  * FROM #tmptbl3 
					union 	 
			        SELECT  @RecordCount AS SNO,MAX(ID)+1,NULL as PAYER_DIVISION, NULL BILLER_DIVISION, NULL as SYS_INVOICE_NUMBER,NULL REFERENCE_INVOICE_NUMBER,NULL as INVOICE_DATE,NULL as ACTIVITY_DATE,NULL as INVOICE_CURRENCY_CODE,
			              SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,NULL ACCOUNTING_REFERENCE,sum(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			             NULL INVOICE_TYPE,NULL BILLER_LOCAL_CURRENCY,NULL BILLER_FOREX_RATE,NULL FOREX_DATE,NULL Biller_prefix_Name,NULL PREFIX_CODE_NAME,NULL BILLSITE_CODE_NAME,NULL PAYSITE_CODE_NAME,NULL BILLER_SITE_CODE,NULL PAYER_PREFIX_CODE,NULL PAYER_SITE_CODE,NULL PAYERPREFIXCODE,
						NULL PAYERPREFIXNAME,NULL BILLERSITECODE,NULL BILLERSITENAME,NULL PAYERSITECODE,NULL PAYERSITENAME, NULL hyperion_code,NULL tariff_code,NULL Special_VAT_Language,
						NULL other_remarks,NULL approved_by,NULL shipping_charges,NULL handling_charges,NULL insurance_charges,NULL additional_cost1,NULL additional_cost1_description,
						NULL additional_cost2,NULL additional_cost2_description,NULL vat_total,NULL informational_currency_code,NULL total_invoice_value_informational_currency,
						NULL statistical_currency_code,NULL statistical_currency_value,'' Gross_Weight,'' Net_Weight,'Grand Total' as total_type FROM #tmptbl11
						) a
						
					 select * from #tmptblfinalInvoice
					 WHERE SNO > Convert(varchar,(@PageIndex*@PageSize)-@PageSize) AND SNO<=convert(varchar,(@PageIndex*@PageSize))
					 --order by ID ASC
					 --order by case when @sortBy='' then 'REFERENCE_INVOICE_NUMBER '+@OrderByDirection else @sortBy+' '+@OrderByDirection end
				END
		     ELSE IF(@IsExport = 1)
				BEGIN
					SELECT *,'' as LocalCurrency FROM #tmptbl3
					union 	 
			        SELECT  NULL AS SNO,MAX(ID)+1,NULL as PAYER_DIVISION, NULL BILLER_DIVISION, NULL as SYS_INVOICE_NUMBER,NULL REFERENCE_INVOICE_NUMBER,NULL as INVOICE_DATE,NULL as ACTIVITY_DATE,NULL as INVOICE_CURRENCY_CODE,
			           SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,NULL ACCOUNTING_REFERENCE,sum(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			             NULL INVOICE_TYPE,NULL BILLER_LOCAL_CURRENCY,NULL BILLER_FOREX_RATE,NULL FOREX_DATE,NULL Biller_prefix_Name,NULL PREFIX_CODE_NAME,NULL BILLSITE_CODE_NAME,NULL PAYSITE_CODE_NAME,NULL BILLER_SITE_CODE,NULL PAYER_PREFIX_CODE,NULL PAYER_SITE_CODE,NULL PAYERPREFIXCODE,
						NULL PAYERPREFIXNAME,NULL BILLERSITECODE,NULL BILLERSITENAME,NULL PAYERSITECODE,NULL PAYERSITENAME, NULL hyperion_code,NULL tariff_code,NULL Special_VAT_Language,
						NULL other_remarks,NULL approved_by,NULL shipping_charges,NULL handling_charges,NULL insurance_charges,NULL additional_cost1,NULL additional_cost1_description,
						NULL additional_cost2,NULL additional_cost2_description,NULL vat_total,NULL informational_currency_code,NULL total_invoice_value_informational_currency,
						NULL statistical_currency_code,NULL statistical_currency_value,'' Gross_Weight,'' Net_Weight,'Grand Total' as total_type,'' as LocalCurrency FROM #tmptbl11
				END	
				
			select @RecordCount+1
			
			if OBJECT_ID('tempdb.dbo.#tmptbl1','U') is not null
			drop table #tmptbl1
			if OBJECT_ID('tempdb.dbo.#tmptbl2','U') is not null
			drop table #tmptbl2
			if OBJECT_ID('tempdb.dbo.#tmptbl3','U') is not null
			drop table #tmptbl3
			if OBJECT_ID('tempdb.dbo.#tmptblfinalInvoice','U') is not null
			drop table #tmptblfinalInvoice
			
		END

        --invoice Detail Level & logged in with GADM access
		--print 'checking invoice Detail Level & logged in with GADM access';
		--If condition added by shiv for billing register report
		If @detail_level= "I" and @billing_prefix_code='0' and @paying_prefix_code='0'
		BEGIN
			;WITH TAB AS (select PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,ACTIVITY_DATE,INVOICE_CURRENCY_CODE,
			               TOTAL_INVOICE_VALUE,ACCOUNTING_REFERENCE,TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,INVOICE_TYPE,BILLER_LOCAL_CURRENCY,BILLER_FOREX_RATE,FOREX_DATE,Biller_prefix_Name,
						PREFIX_CODE_NAME,BILLSITE_CODE_NAME,PAYSITE_CODE_NAME,BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
						PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME,hyperion_code,tariff_code,Special_VAT_Language,
						other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
						additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
						statistical_currency_code,statistical_currency_value,Gross_Weight,Net_Weight 		
		from (
			SELECT ROW_NUMBER() OVER
			(
	            
				ORDER BY 
				CASE WHEN @sortBy = 'reference_invoice_number' AND @OrderByDirection = 'DESC' THEN reference_invoice_number END DESC,
				CASE WHEN @sortBy = 'reference_invoice_number' AND @OrderByDirection = 'ASC' THEN  reference_invoice_number END ASC,
				CASE WHEN @sortBy = 'i.InvoiceDate' AND @OrderByDirection = 'DESC' THEN i.INVOICE_DATE END DESC,
				CASE WHEN @sortBy = 'i.InvoiceDate' AND @OrderByDirection = 'ASC' THEN  i.INVOICE_DATE END ASC,
				CASE WHEN @sortBy = 'IC' AND @OrderByDirection = 'DESC' THEN INVOICE_CURRENCY_CODE END DESC,
				CASE WHEN @sortBy = 'IC' AND @OrderByDirection = 'ASC' THEN INVOICE_CURRENCY_CODE END ASC,
				CASE WHEN @sortBy = 'LA' AND @OrderByDirection = 'DESC' THEN TOTAL_INVOICE_VALUE_LOCAL_CURRENCY END DESC,
				CASE WHEN @sortBy = 'LA' AND @OrderByDirection = 'ASC' THEN TOTAL_INVOICE_VALUE_LOCAL_CURRENCY END ASC,
				CASE WHEN @sortBy = 'IA' AND @OrderByDirection = 'DESC' THEN TOTAL_INVOICE_VALUE END DESC,
				CASE WHEN @sortBy = 'IA' AND @OrderByDirection = 'ASC' THEN TOTAL_INVOICE_VALUE END ASC
				)AS RowNumber,PDIV.division_name AS 'PAYER_DIVISION', BDIV.division_name AS 'BILLER_DIVISION',SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,
i.INVOICE_DATE,ACTIVITY_DATE,INVOICE_CURRENCY_CODE, ROUND(TOTAL_INVOICE_VALUE,2) TOTAL_INVOICE_VALUE,ACCOUNTING_REFERENCE,  
      ROUND(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,2) TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,i.INVOICE_TYPE,BILLER_LOCAL_CURRENCY,BILLER_FOREX_RATE,FOREX_DATE,BP.PREFIX_CODE+' - '+BP.PREFIX_NAME Biller_prefix_Name,
      PP.PREFIX_CODE + ' - ' +  PP.PREFIX_NAME PREFIX_CODE_NAME,BS.SITE_CODE + ' - ' + BS.SITE_NAME BILLSITE_CODE_NAME,PS.SITE_CODE + ' - ' + PS.SITE_NAME PAYSITE_CODE_NAME,  
      BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PP.PREFIX_CODE AS PAYERPREFIXCODE,PP.PREFIX_NAME PAYERPREFIXNAME,BS.SITE_CODE AS BILLERSITECODE,BS.SITE_NAME AS BILLERSITENAME,  
      PS.SITE_CODE PAYERSITECODE,PS.SITE_NAME AS PAYERSITENAME,PP.hyperion_code,tariff_code,Special_VAT_Language,other_remarks,approved_by,ROUND(shipping_charges,2) shipping_charges,ROUND(handling_charges,2) handling_charges,  
      ROUND(insurance_charges,2) insurance_charges,ROUND(additional_cost1,2) additional_cost1,additional_cost1_description,  
      ROUND(additional_cost2,2) additional_cost2,additional_cost2_description,ROUND(vat_total,2) vat_total,informational_currency_code,  
      ROUND(total_invoice_value_informational_currency,2) total_invoice_value_informational_currency,statistical_currency_code,  
      ROUND(statistical_currency_value,2) statistical_currency_value,gross_weight as Gross_Weight,net_weight as Net_Weight      
FROM ims_invoice_header i
join ims_division PDIV on i.sys_division_code=PDIV.sys_division_code
join ims_division BDIV on i.sys_division_code=BDIV.sys_division_code
JOIN ims_prefix BP ON i.biller_prefix_code=bp.sys_prefix_code
JOIN ims_site BS ON i.biller_site_code=bs.sys_site_code
JOIN ims_prefix PP ON i.payer_prefix_code=pp.sys_prefix_code
JOIN ims_site PS ON i.payer_site_code=ps.sys_site_code
JOIN ims_invoice_type it ON i.invoice_type=it.invoice_type_code
WHERE activity_date between @billing_date and @billing_to_date and i.invoice_type =Case @invoice_type   when '0' Then i.invoice_type ELSE  @invoice_type  END    
--ORDER by activity_date asc	    
			) as a)	

				
					
		select * into #temptable1 from (SELECT  *,'' as total_type FROM TAB) a

		 select IDENTITY(INT,1,1) AS ID,* into #temptable11 from #temptable1 where 1 = 0
				
			 if @sortby <> ''
			 begin
			 exec('insert into #temptable11 select *  from #temptable1 order by ' + @sortby + ' '+ @OrderByDirection);
			 End
			 else
			 begin
			 exec('insert into #temptable11 select *  from #temptable1 ');
			 End
			 
		    select * into #temptable2 from (	
		    select * from #temptable11 							
		    UNION ALL		 
			SELECT  MAX(ID)+1,NULL as PAYER_DIVISION, NULL as BILLER_DIVISION, NULL as SYS_INVOICE_NUMBER,NULL REFERENCE_INVOICE_NUMBER,NULL as INVOICE_DATE,NULL as ACTIVITY_DATE,NULL as INVOICE_CURRENCY_CODE,
			              SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,NULL ACCOUNTING_REFERENCE,sum(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			             NULL INVOICE_TYPE,NULL BILLER_LOCAL_CURRENCY,NULL BILLER_FOREX_RATE,NULL FOREX_DATE,NULL Biller_prefix_Name,PREFIX_CODE_NAME+'/'+PAYSITE_CODE_NAME,NULL BILLSITE_CODE_NAME,NULL PAYSITE_CODE_NAME,NULL BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,NULL PAYERPREFIXCODE,
						NULL PAYERPREFIXNAME,NULL BILLERSITECODE,NULL BILLERSITENAME,NULL PAYERSITECODE,NULL PAYERSITENAME, NULL hyperion_code,NULL tariff_code,NULL Special_VAT_Language,
						NULL other_remarks,NULL approved_by,NULL shipping_charges,NULL handling_charges,NULL insurance_charges,NULL additional_cost1,NULL additional_cost1_description,
						NULL additional_cost2,NULL additional_cost2_description,NULL vat_total,NULL informational_currency_code,NULL total_invoice_value_informational_currency,
						NULL statistical_currency_code,NULL statistical_currency_value,'' Gross_Weight,'' Net_Weight,'Sub Total(Paying Site)' as total_type FROM #temptable11
						group by  payer_prefix_code,PREFIX_CODE_NAME,PAYSITE_CODE_NAME,PAYER_SITE_CODE	
						) B
						order by payer_prefix_code asc,BILLER_DIVISION desc
			select ROW_NUMBER() over (order by payer_prefix_code asc,PAYER_SITE_CODE asc,BILLER_DIVISION desc) as SNO,--* 
			ID,PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,ACTIVITY_DATE,INVOICE_CURRENCY_CODE,
			              SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,ACCOUNTING_REFERENCE,
			              SUM(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			             INVOICE_TYPE,BILLER_LOCAL_CURRENCY,BILLER_FOREX_RATE,FOREX_DATE,Biller_prefix_Name,PREFIX_CODE_NAME,BILLSITE_CODE_NAME,PAYSITE_CODE_NAME,
			             BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
						PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME, hyperion_code,tariff_code,Special_VAT_Language,
						other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
						additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
						statistical_currency_code,statistical_currency_value,Gross_Weight,Net_Weight,total_type			
			INTO #TEMPTABLE3 FROM (
			    SELECT * FROM #TEMPTABLE2 						
				) c GROUP BY 
				        ID,PAYER_DIVISION, BILLER_DIVISION, SYS_INVOICE_NUMBER,REFERENCE_INVOICE_NUMBER,INVOICE_DATE,ACTIVITY_DATE,INVOICE_CURRENCY_CODE,
			            ACCOUNTING_REFERENCE,INVOICE_TYPE,BILLER_LOCAL_CURRENCY,BILLER_FOREX_RATE,FOREX_DATE,Biller_prefix_Name,PREFIX_CODE_NAME,BILLSITE_CODE_NAME,
			            PAYSITE_CODE_NAME,BILLER_SITE_CODE,PAYER_PREFIX_CODE,PAYER_SITE_CODE,PAYERPREFIXCODE,
						PAYERPREFIXNAME,BILLERSITECODE,BILLERSITENAME,PAYERSITECODE,PAYERSITENAME, hyperion_code,tariff_code,Special_VAT_Language,
						other_remarks,approved_by,shipping_charges,handling_charges,insurance_charges,additional_cost1,additional_cost1_description,
						additional_cost2,additional_cost2_description,vat_total,informational_currency_code,total_invoice_value_informational_currency,
						statistical_currency_code,statistical_currency_value,Gross_Weight,Net_Weight,total_type
						
				
			SELECT @RecordCount=COUNT(1) FROM #temptable3
			
			IF(@IsExport = 0)
				BEGIN
				select * into #tmptblfinalInvoicegadm from
				(
					SELECT  * FROM #temptable3 
					union 	 
			        SELECT  @RecordCount AS SNO,MAX(ID)+1,NULL as PAYER_DIVISION, NULL BILLER_DIVISION, NULL as SYS_INVOICE_NUMBER,NULL REFERENCE_INVOICE_NUMBER,NULL as INVOICE_DATE,NULL as ACTIVITY_DATE,NULL as INVOICE_CURRENCY_CODE,
			              SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,NULL ACCOUNTING_REFERENCE,sum(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			             NULL INVOICE_TYPE,NULL BILLER_LOCAL_CURRENCY,NULL BILLER_FOREX_RATE,NULL FOREX_DATE,NULL Biller_prefix_Name,NULL PREFIX_CODE_NAME,NULL BILLSITE_CODE_NAME,NULL PAYSITE_CODE_NAME,NULL BILLER_SITE_CODE,NULL PAYER_PREFIX_CODE,NULL PAYER_SITE_CODE,NULL PAYERPREFIXCODE,
						NULL PAYERPREFIXNAME,NULL BILLERSITECODE,NULL BILLERSITENAME,NULL PAYERSITECODE,NULL PAYERSITENAME, NULL hyperion_code,NULL tariff_code,NULL Special_VAT_Language,
						NULL other_remarks,NULL approved_by,NULL shipping_charges,NULL handling_charges,NULL insurance_charges,NULL additional_cost1,NULL additional_cost1_description,
						NULL additional_cost2,NULL additional_cost2_description,NULL vat_total,NULL informational_currency_code,NULL total_invoice_value_informational_currency,
						NULL statistical_currency_code,NULL statistical_currency_value,'' Gross_Weight,'' Net_Weight,'Grand Total' as total_type FROM #temptable11
						) a
						
					 select * from #tmptblfinalInvoicegadm
					 WHERE SNO > Convert(varchar,(@PageIndex*@PageSize)-@PageSize) AND SNO<=convert(varchar,(@PageIndex*@PageSize))
				END
		     ELSE IF(@IsExport = 1)
				BEGIN
					SELECT *,'' as LocalCurrency FROM #temptable3
					union 	 
			        SELECT  NULL AS SNO,MAX(ID)+1,NULL as PAYER_DIVISION, NULL BILLER_DIVISION, NULL as SYS_INVOICE_NUMBER,NULL REFERENCE_INVOICE_NUMBER,NULL as INVOICE_DATE,NULL as ACTIVITY_DATE,NULL as INVOICE_CURRENCY_CODE,
			           SUM(TOTAL_INVOICE_VALUE) as TOTAL_INVOICE_VALUE,NULL ACCOUNTING_REFERENCE,sum(TOTAL_INVOICE_VALUE_LOCAL_CURRENCY) as TOTAL_INVOICE_VALUE_LOCAL_CURRENCY,
			             NULL INVOICE_TYPE,NULL BILLER_LOCAL_CURRENCY,NULL BILLER_FOREX_RATE,NULL FOREX_DATE,NULL Biller_prefix_Name,NULL PREFIX_CODE_NAME,NULL BILLSITE_CODE_NAME,NULL PAYSITE_CODE_NAME,NULL BILLER_SITE_CODE,NULL PAYER_PREFIX_CODE,NULL PAYER_SITE_CODE,NULL PAYERPREFIXCODE,
						NULL PAYERPREFIXNAME,NULL BILLERSITECODE,NULL BILLERSITENAME,NULL PAYERSITECODE,NULL PAYERSITENAME, NULL hyperion_code,NULL tariff_code,NULL Special_VAT_Language,
						NULL other_remarks,NULL approved_by,NULL shipping_charges,NULL handling_charges,NULL insurance_charges,NULL additional_cost1,NULL additional_cost1_description,
						NULL additional_cost2,NULL additional_cost2_description,NULL vat_total,NULL informational_currency_code,NULL total_invoice_value_informational_currency,
						NULL statistical_currency_code,NULL statistical_currency_value,'' Gross_Weight,'' Net_Weight,'Grand Total' as total_type,'' as LocalCurrency FROM #temptable11
				END	
				
			select @RecordCount+1
			
			if OBJECT_ID('tempdb.dbo.#temptable1','U') is not null
			drop table #temptable1
			if OBJECT_ID('tempdb.dbo.#temptable2','U') is not null
			drop table #temptable2
			if OBJECT_ID('tempdb.dbo.#temptable3','U') is not null
			drop table #temptable3
			if OBJECT_ID('tempdb.dbo.#tmptblfinalInvoicegadm','U') is not null
			drop table #tmptblfinalInvoicegadm
			
		END