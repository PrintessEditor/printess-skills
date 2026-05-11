import { externalFormFieldChangeCallback, iExternalFieldListEntry, iExternalFormFieldMeta, iExternalImageFrameDimensions, iExternalImageRotation, iExternalMetaPropertyKind, iExternalProperty, iExternalValidation, iFormFieldNameValue, iFormFieldProperty, iImage, iInitialProperties } from "../../editor/custom-ui/printess-editor.d";

export type BaseFrameProperty = {
    pId: string
}

export type FrameProperty =
    BaseFrameProperty & {
        kind: "image",
        image: iImage | null,
        crop?: {
            xPosition: number; // 0-1
            yPosition: number; // 0-1
            widthScale: number; // 0-1
            heightScale: number; // 0-1
        },
        rotation?: iExternalImageRotation
    } | BaseFrameProperty & {
        kind: "single-line-text",
        text: string
    } | BaseFrameProperty & {
        kind: "color",
        name: string | null,
        color: string
    } | BaseFrameProperty & {
        kind: "font",
        name: string
    } | BaseFrameProperty & {
        kind: "image-id",
        image: iImage
    }


export type iControlGroup = {
    kind: "control-group",
    label: string,
    props: iExternalProperty[],
    templateColumns: string[],
    gaps: number[],
    index: number,
    maxThumbHeight: number
}

export type slimFormField = iExternalFormFieldMeta & { name: string, id: string, p: iExternalProperty };

export interface iSlimUiLoadParams {

    previewContainer: HTMLDivElement,
    uiContainer: HTMLDivElement,
    previewImage: HTMLImageElement,
    loader: HTMLElement,
    templateName: string,
    shopToken: string,
    apiDomain?: string,

    /**
     * If printess should load the published version of the template
     * Default is TRUE
     */
    published?: boolean,

    /**
     * ISO Language key, same like in Printess Panel-Ui.
     */
    lang?: string,

    /**
     * Any Panel-Ui theme name on your account.
     */
    theme?: string,

    /**
     * Optional: layout snippet ID of initial layout
     */
    layout?: string,

    /**
     * Optional: override the layout snippet search tags
     */
    layoutSnippetSearchTags?: Array<string>,

    /**
     * Optional: override the layout keyword menu id
     */
    layoutSnippetMenuId?: string,

    /** Pre-Selected Menu Categorie */
    initialCategory?: string,

    /** Pre-Selected Menu Topic */
    initialTopic?: string,

    /**
     * Optional: override include global layout snippets flag
     */
    includeGlobalLayoutSnippets?: boolean,

    textUpdateTimeout?: "short" | "long",
    sliderUpdateTimeout?: "short" | "long",
    priceCategoryLabels?: { [key: string]: string },
    // colors?: Array<{ name: string, color: string }>,
    // fonts?: Array<{ name: string, thumbUrl: string, displayName: string, familyName: string, weight: number, isItalic: boolean }>,
    fontSizesInPt?: Array<number>,
    fontSizesInPercent?: Array<number>,
    paragraphStyles?: Array<{ class: string, css: string }>,
    showTestBasketButton?: boolean,
    // showCropOverlayButtons?: boolean, //Needs A11y 3rd iteration merged first

    /**
     * The initial form fields you want to fill.
     */
    formFields: Array<iFormFieldNameValue>;

    /**
     * Other initial form-field properties you want to change on attach
     * Form field is indentified by name and paramters are set accordingly
     * to enable the priceRelevant you will need special permissions.
     */
    formFieldProperties?: Array<iFormFieldProperty>;

    /**
    * For every Form Field which is set to **Impact-Price**
    * Printess fires a callback when the value has changed
    */
    formFieldChangedCallback?: externalFormFieldChangeCallback;

    /**
     *  The progress state changed. Shown or hidden.
     *  Printess fires this callback everytime the progress is shown or hidden
     */
    progressStateChangedCallback?: (show: boolean) => void;

    /**
     *  Printess fires this callback every time the preview image needs to be rerendered.
     */
    renderPreviewImageCallback?: (previewImageUrl: string | []) => void;
}
export type iSlimValidationError = { errorMessage: string }
export type iSlimValidationErrors = Array<iSlimValidationError>

export interface iSlimState {
    /**
     * Returns a valid Save Token and Thumbnail Url to store and use later for production.
     * Possibly throws error of type ```iSlimValidationErrors```
     * Contains all failed validation error messages, like missing text or missing image
     *
     * @returns Promise<{ saveToken: string, thumbnailUrl: string }>
     * @throws iSlimValidationErrors
     *
     */
    createSaveToken(): Promise<{ saveToken: string, thumbnailUrl: string }>;

    /**
     * @returns Promise<iSlimValidationErrors>
     * Runs validation and returns errors. Intended for test use.
     * Returns empty Array in case everything is fine.
     * Attention!
     * Calling this methods displays validation error message underneath the affected properties.
     * Which is NOT intended before the user was interacting with this properties.
     */
    validate(): Promise<iSlimValidationErrors>

    getPreviewImageInfo(previewIndex: number, pageIndex: number): Promise<{ url: string, imageFrameDimensions: Record<string, iExternalImageFrameDimensions> }>;
    previews: Array<{ docName: string, pageCount: number, facingPages: boolean }>;
    setFormFieldValue(ffName: string, ffValue: string | number, rerenderUi?: boolean): void;
    importImageFromUrl(url: string, formFieldName: string, progressCallback?: ((uploaded: number, total: number, percent: number) => void), rerenderUi?: boolean): Promise<iImage>;
    importImageFromFile(image: File, formFieldName: string, progressCallback?: ((uploaded: number, total: number, percent: number) => void), rerenderUi?: boolean): Promise<iImage>;
    getSelectedLayoutSnippet(): iSlimSnippet | undefined
}

declare function createSlimUi(params: iSlimUiLoadParams): Promise<iSlimState>;