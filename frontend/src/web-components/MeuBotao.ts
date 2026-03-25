export {};
if (typeof window !== 'undefined') {
    class MeuBotao  extends HTMLElement {
        //metodo q roda sozinho assim q a tag é injetada na tela
        static get observedAttributes() {
        return ['texto', 'disabled'];}

        connectedCallback() {
        this.render();
        }
        attributeChangedCallback(name : string, oldValue: string, newValue: string){
        this.render();
        }
        render(){
        const texto = this.getAttribute('texto') || 'Botão';

        const isDisabled  = this.hasAttribute('disabled');

            const style = isDisabled
                ? "background-color: #d1d5db; color: #374151; padding: 8px 16px; border-radius: 6px; cursor: not-allowed; border: none; font-weight: bold; opacity: 0.8;"
                : "background-color: #2563eb; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; border: none; font-weight: bold;";
        this.innerHTML = `
        <button style="${style}" ${isDisabled ? 'disabled' : ''}">${texto}
        </button>`;
        }
    }

    // tag <meu-botao>
    if (!customElements.get('meu-botao-novo')) {
        customElements.define('meu-botao-novo', MeuBotao);
    }
}

