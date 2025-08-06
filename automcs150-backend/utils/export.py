import fitz  # PyMuPDF
import logging

logger = logging.getLogger(__name__)


def fill_pdf_annotations(input_pdf_path, output_pdf_path, form_data):
    try:
        doc = fitz.open(input_pdf_path)
        for page in doc:
            fields = page.widgets()
            for field in fields:
                field_name = field.field_name
                field_type = field.field_type
                # print(field_name, field_type)

                if not field_name:
                    continue
                if field_name == "1bizName":
                    field.field_value = form_data.get("line1", "")
                    field.update()
                if field_name == "2dbaName":
                    field.field_value = form_data.get("line2", "")
                    field.update()
                if field_name == "3principalStreet":
                    field.field_value = form_data.get("line3_7", {}).get("line3", "")
                    field.update()
                if field_name == "4principalCity":
                    field.field_value = form_data.get("line3_7", {}).get("line4", "")
                    field.update()
                if field_name == "5principalState":
                    field.field_value = form_data.get("line3_7", {}).get("line5", "")
                    field.update()
                if field_name == "6principalZip":
                    field.field_value = form_data.get("line3_7", {}).get("line6", "")
                    field.update()
                if field_name == "7principalColonia":
                    field.field_value = form_data.get("line3_7", {}).get("line7", "")
                    field.update()
                if field_name == "Mailing Button":
                    if field.rect == fitz.Rect(201.0, 444.75, 210.0, 453.75) and (
                        form_data.get("line8_12", {}).get("isSame", "") == True
                    ):
                        field.field_value = 1
                        field.update()
                    if field.rect == fitz.Rect(309.0, 444.75, 318.0, 453.75) and (
                        form_data.get("line8_12", {}).get("isSame", "") == False
                    ):
                        field.field_value = 1
                        field.update()
                if field_name == "8mailStreet":
                    field.field_display = False
                    field.field_value = form_data.get("line8_12", {}).get("line8", "")
                    field.update()
                if field_name == "9mailCity":
                    field.field_display = False
                    field.field_value = form_data.get("line8_12", {}).get("line9", "")
                    field.update()
                if field_name == "10mailState":
                    field.field_display = False
                    field.field_value = form_data.get("line8_12", {}).get("line10", "")
                    field.update()
                if field_name == "11mailZip":
                    field.field_display = False
                    field.field_value = form_data.get("line8_12", {}).get("line11", "")
                    field.update()
                if field_name == "12mailColonia":
                    field.field_display = False
                    field.field_value = form_data.get("line8_12", {}).get("line12", "")
                    field.update()
                if field_name == "13bizPhone":
                    field.field_value = form_data.get("line13_15", {}).get("line13", "")
                    field.update()
                if field_name == "14cellPhone":
                    field.field_value = form_data.get("line13_15", {}).get("line14", "")
                    field.update()
                if field_name == "15faxNumber":
                    field.field_value = form_data.get("line13_15", {}).get("line15", "")
                    field.update()
                if field_name == "16usdotNumber":
                    field.field_value = form_data.get("line16_19", {}).get("line16", "")
                    field.update()
                if field_name == "17mcmxNumber":
                    field.field_value = form_data.get("line16_19", {}).get("line17", "")
                    field.update()
                if field_name == "18dunbradNumber":
                    field.field_value = form_data.get("line16_19", {}).get("line18", "")
                    field.update()
                if field_name == "19irsNumber":
                    field.field_value = form_data.get("line16_19", {}).get("line19", "")
                    field.update()
                if field_name == "20eMail":
                    field.field_value = form_data.get("line20", "")
                    field.update()
                if field_name == "21carrierMileage":
                    field.field_value = form_data.get("line21", "")
                    field.update()
                if field_name == "22aBox":
                    if form_data.get("line22", "") == "A":
                        field.field_value = 1
                        field.update()
                if field_name == "22bBox":
                    if form_data.get("line22", "") == "B":
                        field.field_value = 1
                        field.update()
                if field_name == "22cBox":
                    if form_data.get("line22", "") == "C":
                        field.field_value = 1
                        field.update()
                if field_name == "22dBox":
                    if form_data.get("line22", "") == "D":
                        field.field_value = 1
                        field.update()
                if field_name == "22eBox":
                    if form_data.get("line22", "") == "E":
                        field.field_value = 1
                        field.update()
                if field_name == "23aBox":
                    if "Auth. For Hire" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23bBox":
                    if "Exempt For Hire" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23cBox":
                    if "Private(Property)" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23dBox":
                    if "Priv. Pass. (Business)" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23eBox":
                    if "Priv. Pass.(Non-business)" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23fBox":
                    if "Migrant" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23gBox":
                    if "U.S. Mail" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23hBox":
                    if "Fed. Gov't" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23iBox":
                    if "State Gov't" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23jBox":
                    if "Local Gov't" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "23kBox":
                    if "Indian Nation" in form_data.get("line23", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24aBox":
                    if "General Freight" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24bBox":
                    if "Household Goods" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24cBox":
                    if "Metal: sheets, coils, rolls" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24dBox":
                    if "Motor Vehicles" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24eBox":
                    if "Drive/Tow away" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24fBox":
                    if "Logs, Poles, Beams, Lumber" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24gBox":
                    if "Building Materials" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24hBox":
                    if "Mobile Homes" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24iBox":
                    if "Machinery, Large Objects" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24jBox":
                    if "Fresh Produce" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24kBox":
                    if "Liquids/Gases" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24lBox":
                    if "Intermodal Cont." in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24mBox":
                    if "Passengers" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24nBox":
                    if "Oilfield Equipment" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24oBox":
                    if "Livestock" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24pBox":
                    if "Grain, Feed, Hay" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24qBox":
                    if "Coal/Coke" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24rBox":
                    if "Meat" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24sBox":
                    if "Garbage/Refuse" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24tBox":
                    if "US Mail" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24uBox":
                    if "Chemicals" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24vBox":
                    if "Commodities Dry Bulk" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24wBox":
                    if "Refrigerated Food" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24xBox":
                    if "Beverages" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24yBox":
                    if "Paper Products" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24zBox":
                    if "Utilities" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24aaBox":
                    if "Agricultural/Farm Supplies" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24bbBox":
                    if "Construction" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24ccBox":
                    if "Water Well" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "24ddBox":
                    if len(form_data.get("line24_other", "")):
                        field.field_value = 1
                        field.update()
                if field_name == "24ddDescribe":
                    rect = fitz.Rect(484.0, 244.25, 591.0, 265.25)
                    widget = fitz.Widget()
                    widget.rect = rect
                    widget.field_name = "24ddOther"
                    widget.text_font = field.text_font
                    widget.text_fontsize = field.text_fontsize
                    widget.field_value = form_data.get("line24_other", "")
                    widget.field_type = field_type
                    page.add_widget(widget)
                if field_name == "24ddBox":
                    if len(form_data.get("line24_other", "")):
                        field.field_value = 1
                        field.update()
                if field_name == "25ggCBox":
                    if "Motor Vehicles" in form_data.get("line24", "") or "Drive/Tow away" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                if field_name == "25ggNBBox":
                    if "Motor Vehicles" in form_data.get("line24", "") or "Drive/Tow away" in form_data.get("line24", ""):
                        field.field_value = 1
                        field.update()
                
                if field_name == 'straightOwn':
                    field.field_value = form_data.get("line26a", {}).get("owntruck", "")
                    field.update()
                if field_name == 'tractorOwn':
                    field.field_value = form_data.get("line26a", {}).get("owntract", "")
                    field.update()
                if field_name == 'trailerOwn':
                    field.field_value = form_data.get("line26a", {}).get("owntrail", "")
                    field.update()
                if field_name == 'haztruckOwn':
                    field.field_value = form_data.get("line26a", {}).get("own_haz_truck", "")
                    field.update()
                if field_name == 'haztrailOwn':
                    field.field_value = form_data.get("line26a", {}).get("own_haz_trail", "")
                    field.update()
                if field_name == 'coachOwn':
                    field.field_value = form_data.get("line26a", {}).get("owncoach", "")
                    field.update()
                if field_name == 'school1-8Own':
                    field.field_value = form_data.get("line26a", {}).get("ownschool_1_8", "")
                    field.update()
                if field_name == 'school9-15Own':
                    field.field_value = form_data.get("line26a", {}).get("ownschool_9_15", "")
                    field.update()
                if field_name == 'school16+Own':
                    field.field_value = form_data.get("line26a", {}).get("ownschool_16", "")
                    field.update()
                if field_name == 'bus16+Own':
                    field.field_value = form_data.get("line26a", {}).get("ownbus_16", "")
                    field.update()
                if field_name == 'van1-8Own':
                    field.field_value = form_data.get("line26a", {}).get("ownvan_1_8", "")
                    field.update()
                if field_name == 'van9-15Own':
                    field.field_value = form_data.get("line26a", {}).get("ownvan_9_15", "")
                    field.update()
                if field_name == 'limo1-8Own':
                    field.field_value = form_data.get("line26a", {}).get("ownlimo_1_8", "")
                    field.update()
                if field_name == 'limo9-15Own':
                    field.field_value = form_data.get("line26a", {}).get("ownlimo_9_15", "")
                    field.update()
                if field_name == 'limo16+Own':
                    field.field_value = form_data.get("line26a", {}).get("ownlimo_16", "")
                    field.update()

                if field_name == 'straightTerm':
                    field.field_value = form_data.get("line26a", {}).get("trmtruck", "")
                    field.update()
                if field_name == 'tractorTerm':
                    field.field_value = form_data.get("line26a", {}).get("trmtract", "")
                    field.update()
                if field_name == 'trailerTerm':
                    field.field_value = form_data.get("line26a", {}).get("trmtrail", "")
                    field.update()
                if field_name == 'haztruckTerm':
                    field.field_value = form_data.get("line26a", {}).get("term_haz_truck", "")
                    field.update()
                if field_name == 'haztrailTerm':
                    field.field_value = form_data.get("line26a", {}).get("term_haz_trail", "")
                    field.update()
                if field_name == 'coachTerm':
                    field.field_value = form_data.get("line26a", {}).get("trmcoach", "")
                    field.update()
                if field_name == 'school1-8Term':
                    field.field_value = form_data.get("line26a", {}).get("trmschool_1_8", "")
                    field.update()
                if field_name == 'school9-15Term':
                    field.field_value = form_data.get("line26a", {}).get("trmschool_9_15", "")
                    field.update()
                if field_name == 'school16+Term':
                    field.field_value = form_data.get("line26a", {}).get("trmschool_16", "")
                    field.update()
                if field_name == 'bus16+Term':
                    field.field_value = form_data.get("line26a", {}).get("trmbus_16", "")
                    field.update()
                if field_name == 'van1-8Term':
                    field.field_value = form_data.get("line26a", {}).get("trmvan_1_8", "")
                    field.update()
                if field_name == 'van9-15Term':
                    field.field_value = form_data.get("line26a", {}).get("trmvan_9_15", "")
                    field.update()
                if field_name == 'limo1-8Term':
                    field.field_value = form_data.get("line26a", {}).get("trmlimo_1_8", "")
                    field.update()
                if field_name == 'limo9-15Term':
                    field.field_value = form_data.get("line26a", {}).get("trmlimo_9_15", "")
                    field.update()
                if field_name == 'limo16+Term':
                    field.field_value = form_data.get("line26a", {}).get("trmlimo_16", "")
                    field.update()

                if field_name == 'straightTrip':
                    field.field_value = form_data.get("line26a", {}).get("trptruck", "")
                    field.update()
                if field_name == 'tractorTrip':
                    field.field_value = form_data.get("line26a", {}).get("trptract", "")
                    field.update()
                if field_name == 'trailerTrip':
                    field.field_value = form_data.get("line26a", {}).get("trptrail", "")
                    field.update()
                if field_name == 'haztruckTrip':
                    field.field_value = form_data.get("line26a", {}).get("trip_haz_truck", "")
                    field.update()
                if field_name == 'haztrailTrip':
                    field.field_value = form_data.get("line26a", {}).get("trip_haz_trail", "")
                    field.update()
                if field_name == 'coachTrip':
                    field.field_value = form_data.get("line26a", {}).get("trpcoach", "")
                    field.update()
                if field_name == 'school1-8Trip':
                    field.field_value = form_data.get("line26a", {}).get("trpschool_1_8", "")
                    field.update()
                if field_name == 'school9-15Trip':
                    field.field_value = form_data.get("line26a", {}).get("trpschool_9_15", "")
                    field.update()
                if field_name == 'school16+Trip':
                    field.field_value = form_data.get("line26a", {}).get("trpschool_16", "")
                    field.update()
                if field_name == 'bus16+Trip':
                    field.field_value = form_data.get("line26a", {}).get("trpbus_16", "")
                    field.update()
                if field_name == 'van1-8Trip':
                    field.field_value = form_data.get("line26a", {}).get("trpvan_1_8", "")
                    field.update()
                if field_name == 'van9-15Trip':
                    field.field_value = form_data.get("line26a", {}).get("trpvan_9_15", "")
                    field.update()
                if field_name == 'limo1-8Trip':
                    field.field_value = form_data.get("line26a", {}).get("trplimo_1_8", "")
                    field.update()
                if field_name == 'limo9-15Trip':
                    field.field_value = form_data.get("line26a", {}).get("trplimo_9_15", "")
                    field.update()
                if field_name == 'limo16+Trip':
                    field.field_value = form_data.get("line26a", {}).get("trplimo_16", "")
                    field.update()


                if field_name == 'interWithin':
                    field.field_value = form_data.get("line27", {}).get("interstate_within_100_miles", "")
                    field.update()
                if field_name == 'intraWithin':
                    field.field_value = form_data.get("line27", {}).get("intrastate_within_100_miles", "")
                    field.update()
                if field_name == 'interBeyond':
                    field.field_value = form_data.get("line27", {}).get("interstate_beyond_100_miles", "")
                    field.update()
                if field_name == 'intraBeyond':
                    field.field_value = form_data.get("line27", {}).get("intrastate_beyond_100_miles", "")
                    field.update()
                if field_name == 'totalDrivers':
                    rect = fitz.Rect(406.0, 101.54302978515625, 494.0, 113.54302978515625)
                    widget = fitz.Widget()
                    widget.rect = rect
                    widget.field_name = "_totalDrivers"
                    widget.text_font = field.text_font
                    widget.text_fontsize = field.text_fontsize
                    widget.field_value = form_data.get("line27", {}).get("total_drivers", "")
                    widget.field_type = field_type
                    page.add_widget(widget)
                if field_name == 'totalCDL':
                    rect = fitz.Rect(502.0, 101.54302978515625, 590.0, 113.54302978515625)
                    widget = fitz.Widget()
                    widget.rect = rect
                    widget.field_name = "_totalCDL"
                    widget.text_font = field.text_font
                    widget.text_fontsize = field.text_fontsize
                    widget.field_value = form_data.get("line27", {}).get("total_cdl", "")
                    widget.field_type = field_type
                    page.add_widget(widget)

        doc.save(output_pdf_path)
        # doc.close()
        # doc_new = fitz.open(output_pdf_path)
        for _ in range(8):
            doc.delete_page(0)

        # temp_path = output_pdf_path.split('.pdf')
        doc.save(output_pdf_path)
        doc.close()

        return "Success"
    except Exception as exception:
        logger.error(f"Error filling PDF annotations: {exception}", exc_info=True)
        return "Failed"
