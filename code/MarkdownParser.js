//#region TagType definitions
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TagType;
(function (TagType) {
    TagType[TagType["Paragraph"] = 0] = "Paragraph";
    TagType[TagType["Header1"] = 1] = "Header1";
    TagType[TagType["Header2"] = 2] = "Header2";
    TagType[TagType["Header3"] = 3] = "Header3";
    TagType[TagType["Header4"] = 4] = "Header4";
    TagType[TagType["Header5"] = 5] = "Header5";
    TagType[TagType["Header6"] = 6] = "Header6";
    TagType[TagType["HorizontalRule"] = 7] = "HorizontalRule";
})(TagType || (TagType = {}));
var TagTypeToHtml = /** @class */ (function () {
    function TagTypeToHtml() {
        this.tagType = new Map();
        this.tagType.set(TagType.Header1, "h1");
        this.tagType.set(TagType.Header2, "h2");
        this.tagType.set(TagType.Header3, "h3");
        this.tagType.set(TagType.Header4, "h4");
        this.tagType.set(TagType.Header5, "h5");
        this.tagType.set(TagType.Header6, "h6");
        this.tagType.set(TagType.Paragraph, "p");
        this.tagType.set(TagType.HorizontalRule, "hr");
    }
    TagTypeToHtml.prototype.OpeningTag = function (tagType) {
        return this.GetTag(tagType, "<");
    };
    TagTypeToHtml.prototype.ClosingTag = function (tagType) {
        return this.GetTag(tagType, "</");
    };
    TagTypeToHtml.prototype.GetTag = function (tagType, openingTagPattern) {
        var tag = this.tagType.get(tagType);
        if (tag !== null) {
            return "".concat(openingTagPattern).concat(tag, ">");
        }
        return "".concat(openingTagPattern, "p>");
    };
    return TagTypeToHtml;
}());
var MarkdownDocument = /** @class */ (function () {
    function MarkdownDocument() {
        this.content = "";
    }
    MarkdownDocument.prototype.Add = function () {
        var _this = this;
        var content = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            content[_i] = arguments[_i];
        }
        content.forEach(function (element) {
            _this.content += element;
        });
    };
    MarkdownDocument.prototype.Get = function () {
        return this.content;
    };
    return MarkdownDocument;
}());
//#endregion Markdown document
//#region Parsing elements
var LineParser = /** @class */ (function () {
    function LineParser() {
    }
    LineParser.prototype.Parse = function (value, tag) {
        var output = [false, ""];
        output[1] = value;
        if (value === "") {
            return output;
        }
        var split = value.startsWith("".concat(tag));
        if (split) {
            output[0] = true;
            output[1] = value.substr(tag.length);
        }
        return output;
    };
    return LineParser;
}());
var ParseElement = /** @class */ (function () {
    function ParseElement() {
        this.CurrentLine = "";
    }
    return ParseElement;
}());
var Visitable = /** @class */ (function () {
    function Visitable() {
    }
    Visitable.prototype.Accept = function (visitor, token, markdownDocument) {
        visitor.Visit(token, markdownDocument);
    };
    return Visitable;
}());
var VisitorBase = /** @class */ (function () {
    function VisitorBase(tagType, TagTypeToHtml) {
        this.tagType = tagType;
        this.TagTypeToHtml = TagTypeToHtml;
    }
    VisitorBase.prototype.Visit = function (token, markdownDocument) {
        markdownDocument.Add(this.TagTypeToHtml.OpeningTag(this.tagType), token.CurrentLine, this.TagTypeToHtml.ClosingTag(this.tagType));
    };
    return VisitorBase;
}());
//#endregion Visitor pattern base
//#region Chain of responsibility implementation
var Handler = /** @class */ (function () {
    function Handler() {
        this.next = null;
    }
    Handler.prototype.SetNext = function (next) {
        this.next = next;
    };
    Handler.prototype.HandleRequest = function (request) {
        if (!this.CanHandle(request)) {
            if (this.next != null) {
                this.next.HandleRequest(request);
            }
            return;
        }
    };
    return Handler;
}());
var ParseChainHandler = /** @class */ (function (_super) {
    __extends(ParseChainHandler, _super);
    function ParseChainHandler(document, tagType, visitor) {
        var _this = _super.call(this) || this;
        _this.document = document;
        _this.tagType = tagType;
        _this.visitor = visitor;
        _this.visitable = new Visitable();
        return _this;
    }
    ParseChainHandler.prototype.CanHandle = function (request) {
        var split = new LineParser().Parse(request.CurrentLine, this.tagType);
        if (split[0]) {
            request.CurrentLine = split[1];
            this.visitable.Accept(this.visitor, request, this.document);
        }
        return split[0];
    };
    return ParseChainHandler;
}(Handler));
//#endregion Chain of responsibility implementation
//#region Concrete visitor
var Header1Visitor = /** @class */ (function (_super) {
    __extends(Header1Visitor, _super);
    function Header1Visitor() {
        return _super.call(this, TagType.Header1, new TagTypeToHtml()) || this;
    }
    return Header1Visitor;
}(VisitorBase));
var Header2Visitor = /** @class */ (function (_super) {
    __extends(Header2Visitor, _super);
    function Header2Visitor() {
        return _super.call(this, TagType.Header2, new TagTypeToHtml()) || this;
    }
    return Header2Visitor;
}(VisitorBase));
var Header3Visitor = /** @class */ (function (_super) {
    __extends(Header3Visitor, _super);
    function Header3Visitor() {
        return _super.call(this, TagType.Header3, new TagTypeToHtml()) || this;
    }
    return Header3Visitor;
}(VisitorBase));
var Header4Visitor = /** @class */ (function (_super) {
    __extends(Header4Visitor, _super);
    function Header4Visitor() {
        return _super.call(this, TagType.Header4, new TagTypeToHtml()) || this;
    }
    return Header4Visitor;
}(VisitorBase));
var Header5Visitor = /** @class */ (function (_super) {
    __extends(Header5Visitor, _super);
    function Header5Visitor() {
        return _super.call(this, TagType.Header5, new TagTypeToHtml()) || this;
    }
    return Header5Visitor;
}(VisitorBase));
var Header6Visitor = /** @class */ (function (_super) {
    __extends(Header6Visitor, _super);
    function Header6Visitor() {
        return _super.call(this, TagType.Header6, new TagTypeToHtml()) || this;
    }
    return Header6Visitor;
}(VisitorBase));
var ParagraphVisitor = /** @class */ (function (_super) {
    __extends(ParagraphVisitor, _super);
    function ParagraphVisitor() {
        return _super.call(this, TagType.Paragraph, new TagTypeToHtml()) || this;
    }
    return ParagraphVisitor;
}(VisitorBase));
var HorizontalRuleVisitor = /** @class */ (function (_super) {
    __extends(HorizontalRuleVisitor, _super);
    function HorizontalRuleVisitor() {
        return _super.call(this, TagType.HorizontalRule, new TagTypeToHtml()) || this;
    }
    return HorizontalRuleVisitor;
}(VisitorBase));
//#endregion
//#region Concrete chain of responsibility
var Header1ChainHandler = /** @class */ (function (_super) {
    __extends(Header1ChainHandler, _super);
    function Header1ChainHandler(document) {
        return _super.call(this, document, "# ", new Header1Visitor()) || this;
    }
    return Header1ChainHandler;
}(ParseChainHandler));
var Header2ChainHandler = /** @class */ (function (_super) {
    __extends(Header2ChainHandler, _super);
    function Header2ChainHandler(document) {
        return _super.call(this, document, "## ", new Header2Visitor()) || this;
    }
    return Header2ChainHandler;
}(ParseChainHandler));
var Header3ChainHandler = /** @class */ (function (_super) {
    __extends(Header3ChainHandler, _super);
    function Header3ChainHandler(document) {
        return _super.call(this, document, "### ", new Header3Visitor()) || this;
    }
    return Header3ChainHandler;
}(ParseChainHandler));
var Header4ChainHandler = /** @class */ (function (_super) {
    __extends(Header4ChainHandler, _super);
    function Header4ChainHandler(document) {
        return _super.call(this, document, "#### ", new Header4Visitor()) || this;
    }
    return Header4ChainHandler;
}(ParseChainHandler));
var Header5ChainHandler = /** @class */ (function (_super) {
    __extends(Header5ChainHandler, _super);
    function Header5ChainHandler(document) {
        return _super.call(this, document, "##### ", new Header5Visitor()) || this;
    }
    return Header5ChainHandler;
}(ParseChainHandler));
var Header6ChainHandler = /** @class */ (function (_super) {
    __extends(Header6ChainHandler, _super);
    function Header6ChainHandler(document) {
        return _super.call(this, document, "###### ", new Header6Visitor()) || this;
    }
    return Header6ChainHandler;
}(ParseChainHandler));
var HorizontalRuleHandler = /** @class */ (function (_super) {
    __extends(HorizontalRuleHandler, _super);
    function HorizontalRuleHandler(document) {
        return _super.call(this, document, "---", new HorizontalRuleVisitor()) || this;
    }
    return HorizontalRuleHandler;
}(ParseChainHandler));
var ParagraphHandler = /** @class */ (function (_super) {
    __extends(ParagraphHandler, _super);
    function ParagraphHandler(document) {
        var _this = _super.call(this) || this;
        _this.document = document;
        _this.visitable = new Visitable();
        _this.visitor = new ParagraphVisitor();
        return _this;
    }
    ParagraphHandler.prototype.CanHandle = function (request) {
        this.visitable.Accept(this.visitor, request, this.document);
        return true;
    };
    return ParagraphHandler;
}(Handler));
//#endregion
var ChainOfResponsibilityFactory = /** @class */ (function () {
    function ChainOfResponsibilityFactory() {
    }
    ChainOfResponsibilityFactory.prototype.Build = function (document) {
        var header1 = new Header1ChainHandler(document);
        var header2 = new Header2ChainHandler(document);
        var header3 = new Header3ChainHandler(document);
        var header4 = new Header4ChainHandler(document);
        var header5 = new Header5ChainHandler(document);
        var header6 = new Header6ChainHandler(document);
        var horizontalRule = new HorizontalRuleHandler(document);
        var paragraph = new ParagraphHandler(document);
        header1.SetNext(header2);
        header2.SetNext(header3);
        header3.SetNext(header4);
        header4.SetNext(header5);
        header5.SetNext(header6);
        header6.SetNext(horizontalRule);
        horizontalRule.SetNext(paragraph);
        return header1;
    };
    return ChainOfResponsibilityFactory;
}());
var Markdown = /** @class */ (function () {
    function Markdown() {
    }
    Markdown.prototype.ToHtml = function (text) {
        var document = new MarkdownDocument();
        var header1 = new ChainOfResponsibilityFactory().Build(document);
        var lines = text.split("\n");
        for (var index = 0; index < lines.length; index++) {
            var parseElement = new ParseElement();
            parseElement.CurrentLine = lines[index];
            header1.HandleRequest(parseElement);
        }
        return document.Get();
    };
    return Markdown;
}());
var HtmlHandler = /** @class */ (function () {
    function HtmlHandler() {
        this.markdownChange = new Markdown;
    }
    HtmlHandler.prototype.TextChangeHandler = function (id, output) {
        var _this = this;
        var markdown = document.getElementById(id);
        var markdownOutput = document.getElementById(output);
        if (markdown !== null) {
            markdown.onkeyup = function (e) {
                _this.RenderHtmlContent(markdown, markdownOutput);
            };
            window.onload = function (e) {
                _this.RenderHtmlContent(markdown, markdownOutput);
            };
        }
    };
    HtmlHandler.prototype.RenderHtmlContent = function (markdown, markdownOutput) {
        if (markdown.value) {
            markdownOutput.innerHTML = this.markdownChange.ToHtml(markdown.value);
        }
        else
            markdownOutput.innerHTML = "<p></p>";
    };
    return HtmlHandler;
}());
